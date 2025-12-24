namespace Nexus.Services.Inventory.DTOs;

public class CreateProductRequest
{
    public string Name { get; set; } = string.Empty;
    public string Sku { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? Category { get; set; }
    public decimal Price { get; set; }
    public int InitialStock { get; set; }
    public int ReorderLevel { get; set; }
    public string? UnitOfMeasure { get; set; }
    public Guid? WarehouseId { get; set; }
}

public class UpdateProductRequest
{
    public string? Name { get; set; }
    public string? Description { get; set; }
    public string? Category { get; set; }
    public decimal? Price { get; set; }
    public int? ReorderLevel { get; set; }
    public bool? IsActive { get; set; }
}

public class ProductResponse
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Sku { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? Category { get; set; }
    public decimal Price { get; set; }
    public int StockQuantity { get; set; }
    public int ReorderLevel { get; set; }
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}

public class StockUpdateRequest
{
    public int Quantity { get; set; }
    public string AdjustmentType { get; set; } = string.Empty; // INCREMENT, DECREMENT, SET
    public string Reason { get; set; } = string.Empty;
    public string? ReferenceNumber { get; set; }
    public Guid? ReferenceId { get; set; }
}

public class InventorySearchRequest
{
    public string? SearchTerm { get; set; }
    public string? Category { get; set; }
    public bool? IsActive { get; set; }
    public bool? LowStockOnly { get; set; }
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 10;
    public string? SortBy { get; set; }
    public bool SortDescending { get; set; } = false;
}