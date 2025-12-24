using Microsoft.EntityFrameworkCore;
using Nexus.BuildingBlocks.Infrastructure;
using Nexus.Services.Inventory.Models;

namespace Nexus.Services.Inventory.Data;

public class InventoryDbContext : BaseDbContext
{
    public InventoryDbContext(DbContextOptions<InventoryDbContext> options)
        : base(options)
    {
    }

    public DbSet<Product> Products { get; set; } = null!;
    public DbSet<Warehouse> Warehouses { get; set; } = null!;
    public DbSet<StockMovement> StockMovements { get; set; } = null!;
    public DbSet<InventoryAlert> InventoryAlerts { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Configure Product

        modelBuilder.Entity<Product>(entity =>
        {
            entity.HasKey(e => e.Id);

            entity.Property(e => e.Name)
                .IsRequired()
                .HasMaxLength(200);

            entity.Property(e => e.Sku)
                .IsRequired()
                .HasMaxLength(50);

            entity.Property(e => e.Description)
                .HasMaxLength(1000);

            entity.Property(e => e.Category)
                .HasMaxLength(100);

            // ADD PRECISION for Price property (18 total digits, 2 decimal places)
            entity.Property(e => e.Price)
                .HasColumnType("decimal(18,2)"); // or .HasPrecision(18, 2)

            entity.Property(e => e.UnitOfMeasure)
                .HasMaxLength(20);

            // ADD PRECISION for Weight property
            entity.Property(e => e.Weight)
                .HasColumnType("decimal(10,3)"); // 10 total digits, 3 decimal places

            entity.Property(e => e.Dimensions)
                .HasMaxLength(100);

            entity.Property(e => e.ImageUrl)
                .HasMaxLength(500);

            entity.HasIndex(e => e.Sku)
                .IsUnique();

            entity.HasIndex(e => e.Name);
            entity.HasIndex(e => e.Category);
            entity.HasIndex(e => e.IsActive);

            entity.HasQueryFilter(e => !e.IsDeleted);

            // Relationships
            entity.HasOne(e => e.Warehouse)
                .WithMany(w => w.Products)
                .HasForeignKey(e => e.WarehouseId)
                .OnDelete(DeleteBehavior.SetNull);

            entity.HasMany(e => e.StockMovements)
                .WithOne(sm => sm.Product)
                .HasForeignKey(sm => sm.ProductId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // Configure Warehouse
        modelBuilder.Entity<Warehouse>(entity =>
        {
            entity.HasKey(e => e.Id);

            entity.Property(e => e.Name)
                .IsRequired()
                .HasMaxLength(200);

            entity.Property(e => e.Code)
                .IsRequired()
                .HasMaxLength(50);

            entity.Property(e => e.Address)
                .HasMaxLength(500);

            entity.Property(e => e.City)
                .HasMaxLength(100);

            entity.Property(e => e.State)
                .HasMaxLength(100);

            entity.Property(e => e.Country)
                .HasMaxLength(100);

            entity.Property(e => e.PostalCode)
                .HasMaxLength(20);

            entity.Property(e => e.ContactPerson)
                .HasMaxLength(200);

            entity.Property(e => e.PhoneNumber)
                .HasMaxLength(20);

            entity.Property(e => e.Email)
                .HasMaxLength(200);

            entity.Property(e => e.Capacity)
                .HasColumnType("decimal(18,2)");

            entity.Property(e => e.CurrentOccupancy)
                .HasColumnType("decimal(18,2)");

            entity.HasIndex(e => e.Code)
                .IsUnique();

            entity.HasIndex(e => e.Name);
            entity.HasIndex(e => e.IsActive);

            entity.HasQueryFilter(e => !e.IsDeleted);

            // Relationships
            entity.HasMany(e => e.Products)
                .WithOne(p => p.Warehouse)
                .HasForeignKey(p => p.WarehouseId)
                .OnDelete(DeleteBehavior.SetNull);

            entity.HasMany(e => e.StockMovements)
                .WithOne(sm => sm.Warehouse)
                .HasForeignKey(sm => sm.WarehouseId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        // Configure StockMovement
        modelBuilder.Entity<StockMovement>(entity =>
        {
            entity.HasKey(e => e.Id);

            entity.Property(e => e.MovementType)
                .IsRequired()
                .HasMaxLength(50);

            entity.Property(e => e.Reason)
                .HasMaxLength(500);

            entity.Property(e => e.ReferenceNumber)
                .HasMaxLength(100);

            entity.HasIndex(e => e.MovementDate);
            entity.HasIndex(e => e.ProductId);
            entity.HasIndex(e => e.WarehouseId);
            entity.HasIndex(e => e.ReferenceId);

            entity.HasQueryFilter(e => !e.IsDeleted);
        });

        // Configure InventoryAlert
        modelBuilder.Entity<InventoryAlert>(entity =>
        {
            entity.HasKey(e => e.Id);

            entity.Property(e => e.AlertType)
                .IsRequired()
                .HasMaxLength(50);

            entity.Property(e => e.Message)
                .IsRequired()
                .HasMaxLength(1000);

            entity.Property(e => e.ResolvedBy)
                .HasMaxLength(100);

            entity.HasIndex(e => e.ProductId);
            entity.HasIndex(e => e.AlertType);
            entity.HasIndex(e => e.IsResolved);
            entity.HasIndex(e => e.CreatedAt);

            entity.HasQueryFilter(e => !e.IsDeleted);

            // Relationships
            entity.HasOne(e => e.Product)
                .WithMany()
                .HasForeignKey(e => e.ProductId)
                .OnDelete(DeleteBehavior.Cascade);
        });
    }

    protected override string GetCurrentUser()
    {
        // In a real application, get this from IHttpContextAccessor or similar
        return "system";
    }
}