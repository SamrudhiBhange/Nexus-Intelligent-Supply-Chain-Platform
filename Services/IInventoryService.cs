using MassTransit; // Add this
using Microsoft.EntityFrameworkCore; // Add this
using Nexus.Services.Inventory.Data; // Add this
using Nexus.Services.Inventory.DTOs;
using Nexus.Services.Inventory.Models;
using Nexus.Shared.Contracts.Commands; // Add this
using Nexus.Shared.Contracts.DTOs;
using Nexus.Shared.Contracts.Events; // Add this

namespace Nexus.Services.Inventory.Services;

public interface IInventoryService
{
    Task<ProductResponse> CreateProductAsync(CreateProductRequest request);
    Task<ProductResponse> GetProductAsync(Guid productId);
    Task<PaginatedResponse<ProductResponse>> SearchProductsAsync(InventorySearchRequest request);
    Task<ProductResponse> UpdateProductAsync(Guid productId, UpdateProductRequest request);
    Task<bool> DeleteProductAsync(Guid productId);
    Task<ProductResponse> UpdateStockAsync(Guid productId, StockUpdateRequest request);
    Task<List<StockMovement>> GetProductStockHistoryAsync(Guid productId);
    Task<bool> CheckStockAvailabilityAsync(Guid productId, int quantity);
    Task ReserveStockAsync(Guid productId, int quantity, string reference);
    Task ReleaseStockAsync(Guid productId, int quantity, string reference);
}

public class InventoryService : IInventoryService
{
    private readonly InventoryDbContext _context;
    private readonly ILogger<InventoryService> _logger;
    private readonly IPublishEndpoint _publishEndpoint;

    public InventoryService(
        InventoryDbContext context,
        ILogger<InventoryService> logger,
        IPublishEndpoint publishEndpoint)
    {
        _context = context;
        _logger = logger;
        _publishEndpoint = publishEndpoint;
    }

    public async Task<ProductResponse> CreateProductAsync(CreateProductRequest request)
    {
        try
        {
            // Check if SKU already exists
            var existingProduct = await _context.Products.FirstOrDefaultAsync(p => p.Sku == request.Sku);

            if (existingProduct != null)
                throw new InvalidOperationException($"Product with SKU '{request.Sku}' already exists.");

            var product = new Product
            {
                Name = request.Name,
                Sku = request.Sku,
                Description = request.Description,
                Category = request.Category,
                Price = request.Price,
                StockQuantity = request.InitialStock,
                ReorderLevel = request.ReorderLevel,
                UnitOfMeasure = request.UnitOfMeasure,
                WarehouseId = request.WarehouseId,
                IsActive = true,
                CreatedBy = "system" // Get from authenticated user
            };

            await _context.Products.AddAsync(product);

            // Create initial stock movement
            if (request.InitialStock > 0)
            {
                var stockMovement = new StockMovement
                {
                    ProductId = product.Id,
                    MovementType = "INITIAL",
                    Quantity = request.InitialStock,
                    PreviousStock = 0,
                    NewStock = request.InitialStock,
                    Reason = "Initial stock",
                    MovementDate = DateTime.UtcNow,
                    CreatedBy = "system"
                };

                await _context.StockMovements.AddAsync(stockMovement);
            }

            await _context.SaveChangesAsync();

            // Publish event
            await _publishEndpoint.Publish(new ProductCreatedEvent
            {
                ProductId = product.Id,
                Name = product.Name,
                Sku = product.Sku,
                Price = product.Price,
                InitialStock = product.StockQuantity
            });

            _logger.LogInformation("Product created: {Sku} - {Name}", product.Sku, product.Name);

            return MapToProductResponse(product);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating product with SKU: {Sku}", request.Sku);
            throw;
        }
    }

    public async Task<ProductResponse> GetProductAsync(Guid productId)
    {
        var product = await _context.Products
            .FirstOrDefaultAsync(p => p.Id == productId && !p.IsDeleted);

        if (product == null)
            throw new KeyNotFoundException($"Product with ID {productId} not found.");

        return MapToProductResponse(product);
    }

    public async Task<PaginatedResponse<ProductResponse>> SearchProductsAsync(InventorySearchRequest request)
    {
        var query = _context.Products
            .Where(p => !p.IsDeleted)
            .AsQueryable();

        // Apply filters
        if (!string.IsNullOrEmpty(request.SearchTerm))
        {
            query = query.Where(p =>
                p.Name.Contains(request.SearchTerm) ||
                p.Sku.Contains(request.SearchTerm) ||
                (p.Description != null && p.Description.Contains(request.SearchTerm)));
        }

        if (!string.IsNullOrEmpty(request.Category))
        {
            query = query.Where(p => p.Category == request.Category);
        }

        if (request.IsActive.HasValue)
        {
            query = query.Where(p => p.IsActive == request.IsActive.Value);
        }

        if (request.LowStockOnly.HasValue && request.LowStockOnly.Value)
        {
            query = query.Where(p => p.StockQuantity <= p.ReorderLevel);
        }

        // Get total count
        var totalCount = await query.CountAsync();

        // Apply sorting
        query = request.SortBy?.ToLower() switch
        {
            "name" => request.SortDescending
                ? query.OrderByDescending(p => p.Name)
                : query.OrderBy(p => p.Name),
            "price" => request.SortDescending
                ? query.OrderByDescending(p => p.Price)
                : query.OrderBy(p => p.Price),
            "stock" => request.SortDescending
                ? query.OrderByDescending(p => p.StockQuantity)
                : query.OrderBy(p => p.StockQuantity),
            _ => request.SortDescending
                ? query.OrderByDescending(p => p.CreatedAt)
                : query.OrderBy(p => p.CreatedAt)
        };

        // Apply pagination
        var items = await query
            .Skip((request.PageNumber - 1) * request.PageSize)
            .Take(request.PageSize)
            .Select(p => MapToProductResponse(p))
            .ToListAsync();

        return new PaginatedResponse<ProductResponse>
        {
            Items = items,
            PageNumber = request.PageNumber,
            PageSize = request.PageSize,
            TotalCount = totalCount,
            TotalPages = (int)Math.Ceiling(totalCount / (double)request.PageSize)
        };
    }

    public async Task<ProductResponse> UpdateProductAsync(Guid productId, UpdateProductRequest request)
    {
        var product = await _context.Products
            .FirstOrDefaultAsync(p => p.Id == productId && !p.IsDeleted);

        if (product == null)
            throw new KeyNotFoundException($"Product with ID {productId} not found.");

        // Update fields if provided
        if (!string.IsNullOrEmpty(request.Name))
            product.Name = request.Name;

        if (!string.IsNullOrEmpty(request.Description))
            product.Description = request.Description;

        if (!string.IsNullOrEmpty(request.Category))
            product.Category = request.Category;

        if (request.Price.HasValue)
            product.Price = request.Price.Value;

        if (request.ReorderLevel.HasValue)
            product.ReorderLevel = request.ReorderLevel.Value;

        if (request.IsActive.HasValue)
            product.IsActive = request.IsActive.Value;

        product.UpdatedAt = DateTime.UtcNow;
        product.UpdatedBy = "system"; // Get from authenticated user

        await _context.SaveChangesAsync();

        _logger.LogInformation("Product updated: {ProductId}", productId);

        return MapToProductResponse(product);
    }

    public async Task<bool> DeleteProductAsync(Guid productId)
    {
        var product = await _context.Products
            .FirstOrDefaultAsync(p => p.Id == productId && !p.IsDeleted);

        if (product == null)
            throw new KeyNotFoundException($"Product with ID {productId} not found.");

        // Soft delete
        product.IsDeleted = true;
        product.UpdatedAt = DateTime.UtcNow;
        product.UpdatedBy = "system";

        await _context.SaveChangesAsync();

        _logger.LogInformation("Product deleted: {ProductId}", productId);

        return true;
    }

    public async Task<ProductResponse> UpdateStockAsync(Guid productId, StockUpdateRequest request)
    {
        var product = await _context.Products
            .FirstOrDefaultAsync(p => p.Id == productId && !p.IsDeleted);

        if (product == null)
            throw new KeyNotFoundException($"Product with ID {productId} not found.");

        var previousStock = product.StockQuantity;
        int newStock;

        switch (request.AdjustmentType.ToUpper())
        {
            case "INCREMENT":
                newStock = previousStock + request.Quantity;
                break;
            case "DECREMENT":
                if (previousStock < request.Quantity)
                    throw new InvalidOperationException($"Insufficient stock. Available: {previousStock}, Requested: {request.Quantity}");
                newStock = previousStock - request.Quantity;
                break;
            case "SET":
                newStock = request.Quantity;
                break;
            default:
                throw new ArgumentException($"Invalid adjustment type: {request.AdjustmentType}");
        }

        if (newStock < 0)
            throw new InvalidOperationException("Stock cannot be negative.");

        // Update product stock
        product.StockQuantity = newStock;
        product.UpdatedAt = DateTime.UtcNow;
        product.UpdatedBy = "system";

        // Create stock movement record
        var stockMovement = new StockMovement
        {
            ProductId = productId,
            MovementType = request.AdjustmentType,
            Quantity = Math.Abs(newStock - previousStock),
            PreviousStock = previousStock,
            NewStock = newStock,
            Reason = request.Reason,
            ReferenceNumber = request.ReferenceNumber,
            ReferenceId = request.ReferenceId,
            MovementDate = DateTime.UtcNow,
            CreatedBy = "system"
        };

        await _context.StockMovements.AddAsync(stockMovement);

        // Check for alerts
        await CheckAndCreateAlertsAsync(product);

        await _context.SaveChangesAsync();

        // Publish stock updated event
        await _publishEndpoint.Publish(new StockUpdatedEvent
        {
            ProductId = productId,
            OldQuantity = previousStock,
            NewQuantity = newStock,
            Reason = request.Reason,
            OrderId = request.ReferenceId
        });

        _logger.LogInformation("Stock updated for product {ProductId}: {Previous} -> {New}",
            productId, previousStock, newStock);

        return MapToProductResponse(product);
    }

    public async Task<List<StockMovement>> GetProductStockHistoryAsync(Guid productId)
    {
        return await _context.StockMovements
            .Where(sm => sm.ProductId == productId && !sm.IsDeleted)
            .OrderByDescending(sm => sm.MovementDate)
            .ToListAsync();
    }

    public async Task<bool> CheckStockAvailabilityAsync(Guid productId, int quantity)
    {
        var product = await _context.Products
            .FirstOrDefaultAsync(p => p.Id == productId && !p.IsDeleted && p.IsActive);

        if (product == null)
            return false;

        return product.StockQuantity >= quantity;
    }

    public async Task ReserveStockAsync(Guid productId, int quantity, string reference)
    {
        var product = await _context.Products
            .FirstOrDefaultAsync(p => p.Id == productId && !p.IsDeleted);

        if (product == null)
            throw new KeyNotFoundException($"Product with ID {productId} not found.");

        if (product.StockQuantity < quantity)
            throw new InvalidOperationException($"Insufficient stock. Available: {product.StockQuantity}, Requested: {quantity}");

        product.StockQuantity -= quantity;

        // Create stock movement for reservation
        var stockMovement = new StockMovement
        {
            ProductId = productId,
            MovementType = "RESERVED",
            Quantity = quantity,
            PreviousStock = product.StockQuantity + quantity,
            NewStock = product.StockQuantity,
            Reason = $"Reserved for {reference}",
            ReferenceNumber = reference,
            MovementDate = DateTime.UtcNow,
            CreatedBy = "system"
        };

        await _context.StockMovements.AddAsync(stockMovement);
        await _context.SaveChangesAsync();

        _logger.LogInformation("Stock reserved: {ProductId} x {Quantity} for {Reference}",
            productId, quantity, reference);
    }

    public async Task ReleaseStockAsync(Guid productId, int quantity, string reference)
    {
        var product = await _context.Products
            .FirstOrDefaultAsync(p => p.Id == productId && !p.IsDeleted);

        if (product == null)
            throw new KeyNotFoundException($"Product with ID {productId} not found.");

        product.StockQuantity += quantity;

        // Create stock movement for release
        var stockMovement = new StockMovement
        {
            ProductId = productId,
            MovementType = "RELEASED",
            Quantity = quantity,
            PreviousStock = product.StockQuantity - quantity,
            NewStock = product.StockQuantity,
            Reason = $"Released from {reference}",
            ReferenceNumber = reference,
            MovementDate = DateTime.UtcNow,
            CreatedBy = "system"
        };

        await _context.StockMovements.AddAsync(stockMovement);
        await _context.SaveChangesAsync();

        _logger.LogInformation("Stock released: {ProductId} x {Quantity} from {Reference}",
            productId, quantity, reference);
    }

    private async Task CheckAndCreateAlertsAsync(Product product)
    {
        // Check for low stock
        if (product.StockQuantity <= product.ReorderLevel)
        {
            var existingAlert = await _context.InventoryAlerts
                .FirstOrDefaultAsync(a =>
                    a.ProductId == product.Id &&
                    a.AlertType == "LOW_STOCK" &&
                    !a.IsResolved);

            if (existingAlert == null)
            {
                var alert = new InventoryAlert
                {
                    ProductId = product.Id,
                    AlertType = "LOW_STOCK",
                    Message = $"Product {product.Name} (SKU: {product.Sku}) is low on stock. Current: {product.StockQuantity}, Reorder Level: {product.ReorderLevel}",
                    CreatedBy = "system"
                };

                await _context.InventoryAlerts.AddAsync(alert);
            }
        }

        // Check for out of stock
        if (product.StockQuantity == 0)
        {
            var existingAlert = await _context.InventoryAlerts
                .FirstOrDefaultAsync(a =>
                    a.ProductId == product.Id &&
                    a.AlertType == "OUT_OF_STOCK" &&
                    !a.IsResolved);

            if (existingAlert == null)
            {
                var alert = new InventoryAlert
                {
                    ProductId = product.Id,
                    AlertType = "OUT_OF_STOCK",
                    Message = $"Product {product.Name} (SKU: {product.Sku}) is out of stock.",
                    CreatedBy = "system"
                };

                await _context.InventoryAlerts.AddAsync(alert);
            }
        }
    }

    private ProductResponse MapToProductResponse(Product product)
    {
        return new ProductResponse
        {
            Id = product.Id,
            Name = product.Name,
            Sku = product.Sku,
            Description = product.Description,
            Category = product.Category,
            Price = product.Price,
            StockQuantity = product.StockQuantity,
            ReorderLevel = product.ReorderLevel,
            IsActive = product.IsActive,
            CreatedAt = product.CreatedAt,
            UpdatedAt = product.UpdatedAt
        };
    }
}