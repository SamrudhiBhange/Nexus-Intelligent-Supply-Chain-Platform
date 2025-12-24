using FluentValidation;
using FluentValidation.AspNetCore;
using MassTransit;
using Microsoft.AspNetCore.Authentication.JwtBearer; // Add this
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Nexus.Services.Inventory.Consumers;
using Nexus.Services.Inventory.Data;
using Nexus.Services.Inventory.Models;
using Nexus.Services.Inventory.Services;
using Nexus.Services.Inventory.Validators;
using Serilog;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add Serilog
Log.Logger = new LoggerConfiguration()
    .ReadFrom.Configuration(builder.Configuration)
    .Enrich.FromLogContext()
    .CreateLogger();

builder.Host.UseSerilog();

// Add services to the container
builder.Services.AddControllers();

// Add FluentValidation
builder.Services.AddFluentValidationAutoValidation();
builder.Services.AddFluentValidationClientsideAdapters();
builder.Services.AddValidatorsFromAssemblyContaining<CreateProductValidator>();

// Configure DbContext
builder.Services.AddDbContext<InventoryDbContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection"),
        sqlOptions => sqlOptions.MigrationsAssembly(typeof(Program).Assembly.FullName)));

// Configure JWT Authentication
//var jwtKey = builder.Configuration["Jwt:Key"] ??
//    throw new InvalidOperationException("JWT Key not configured");
//var key = Encoding.UTF8.GetBytes(jwtKey);

// Only configure JWT if we're NOT in design-time mode
// Program.cs - CLEAN VERSION

// ... other service configurations ...

// JWT Configuration 
var isDesignTime = args.Contains("--design-time") ||
                   Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") == "Design";

if (!isDesignTime)
{
    // SINGLE jwtKey declaration
    var jwtKey = builder.Configuration["Jwt:Key"] ??
        throw new InvalidOperationException("JWT Key not configured");

    var key = Encoding.UTF8.GetBytes(jwtKey);

    builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
        .AddJwtBearer(options =>
        {
            options.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,
                ValidIssuer = builder.Configuration["Jwt:Issuer"],
                ValidAudience = builder.Configuration["Jwt:Audience"],
                IssuerSigningKey = new SymmetricSecurityKey(key),
                ClockSkew = TimeSpan.Zero
            };
        });
}

// Add Authorization
builder.Services.AddAuthorization();

// Add Redis Cache
builder.Services.AddStackExchangeRedisCache(options =>
{
    options.Configuration = builder.Configuration.GetConnectionString("Redis");
    options.InstanceName = "Inventory_";
});

// Add MassTransit with RabbitMQ
builder.Services.AddMassTransit(x =>
{
    x.AddConsumer<ReserveStockConsumer>();
    x.AddConsumer<ReleaseStockConsumer>();

    x.UsingRabbitMq((context, cfg) =>
    {
        cfg.Host(builder.Configuration["RabbitMQ:Host"], h =>
        {
            h.Username(builder.Configuration["RabbitMQ:Username"]);
            h.Password(builder.Configuration["RabbitMQ:Password"]);
        });

        cfg.ConfigureEndpoints(context);
    });
});

// Register Services
builder.Services.AddScoped<IInventoryService, InventoryService>();

// Add AutoMapper
builder.Services.AddAutoMapper(typeof(Program).Assembly);

// Add Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Nexus Inventory Service API",
        Version = "v1",
        Description = "Inventory management service for Nexus SCM"
    });

    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme.",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.Http,
        Scheme = "bearer"
    });

    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

// Add CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// Add Health Checks
builder.Services.AddHealthChecks()
    .AddSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")!,
        name: "inventory-db",
        tags: new[] { "database", "sql" })
    .AddRedis(builder.Configuration.GetConnectionString("Redis")!,
        name: "inventory-redis",
        tags: new[] { "cache", "redis" });
var app = builder.Build();

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
    app.UseDeveloperExceptionPage();
}

app.UseSerilogRequestLogging();

app.UseHttpsRedirection();

app.UseCors("AllowAll");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.MapHealthChecks("/health");

// Seed database
using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<InventoryDbContext>();
    await dbContext.Database.EnsureCreatedAsync();

    // Seed initial data if needed
    if (!dbContext.Products.Any())
    {
        await SeedData.SeedInventoryAsync(dbContext);
    }
}

app.Run();

// Seed methods
public static class SeedData
{
    public static async Task SeedInventoryAsync(InventoryDbContext context)
    {
        var warehouse = new Warehouse
        {
            Id = Guid.NewGuid(),
            Name = "Main Warehouse",
            Code = "WH-001",
            Address = "123 Main St",
            City = "New York",
            State = "NY",
            Country = "USA",
            PostalCode = "10001",
            ContactPerson = "John Doe",
            PhoneNumber = "+1-555-0101",
            Email = "warehouse@nexus.com",
            Capacity = 10000,
            CurrentOccupancy = 0,
            IsActive = true,
            CreatedBy = "system"
        };

        await context.Warehouses.AddAsync(warehouse);

        var products = new List<Product>
        {
            new Product
            {
                Id = Guid.NewGuid(),
                Name = "Laptop Pro",
                Sku = "LT-1001",
                Description = "High-performance business laptop",
                Category = "Electronics",
                Price = 1299.99m,
                StockQuantity = 50,
                ReorderLevel = 10,
                MinimumStock = 5,
                MaximumStock = 100,
                UnitOfMeasure = "pcs",
                Weight = 2.5m,
                Dimensions = "35x24x2 cm",
                WarehouseId = warehouse.Id,
                IsActive = true,
                CreatedBy = "system"
            },
            new Product
            {
                Id = Guid.NewGuid(),
                Name = "Wireless Mouse",
                Sku = "MS-2001",
                Description = "Ergonomic wireless mouse",
                Category = "Electronics",
                Price = 39.99m,
                StockQuantity = 200,
                ReorderLevel = 50,
                MinimumStock = 20,
                MaximumStock = 500,
                UnitOfMeasure = "pcs",
                Weight = 0.2m,
                Dimensions = "10x6x3 cm",
                WarehouseId = warehouse.Id,
                IsActive = true,
                CreatedBy = "system"
            },
            new Product
            {
                Id = Guid.NewGuid(),
                Name = "Mechanical Keyboard",
                Sku = "KB-3001",
                Description = "RGB mechanical gaming keyboard",
                Category = "Electronics",
                Price = 149.99m,
                StockQuantity = 75,
                ReorderLevel = 20,
                MinimumStock = 10,
                MaximumStock = 200,
                UnitOfMeasure = "pcs",
                Weight = 1.2m,
                Dimensions = "44x14x3 cm",
                WarehouseId = warehouse.Id,
                IsActive = true,
                CreatedBy = "system"
            }
        };

        await context.Products.AddRangeAsync(products);
        await context.SaveChangesAsync();

        Log.Information("Seeded inventory with {WarehouseCount} warehouse and {ProductCount} products",
            1, products.Count);
    }
}