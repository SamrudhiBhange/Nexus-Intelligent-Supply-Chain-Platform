using Nexus.BuildingBlocks.Common;

namespace Nexus.Services.Inventory.Models;

public class Product : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string Sku { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? Category { get; set; }
    public decimal Price { get; set; }
    public int StockQuantity { get; set; }
    public int ReorderLevel { get; set; }
    public int MinimumStock { get; set; }
    public int MaximumStock { get; set; }
    public string? UnitOfMeasure { get; set; }
    public decimal Weight { get; set; }
    public string? Dimensions { get; set; }
    public string? ImageUrl { get; set; }
    public bool IsActive { get; set; } = true;
    public Guid? WarehouseId { get; set; }

    // Navigation properties
    public virtual Warehouse? Warehouse { get; set; }
    public virtual ICollection<StockMovement> StockMovements { get; set; } = new List<StockMovement>();
}