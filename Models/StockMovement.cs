using Nexus.BuildingBlocks.Common;

namespace Nexus.Services.Inventory.Models;

public class StockMovement : BaseEntity
{
    public Guid ProductId { get; set; }
    public Guid? WarehouseId { get; set; }
    public string MovementType { get; set; } = string.Empty; // IN, OUT, ADJUSTMENT
    public int Quantity { get; set; }
    public int PreviousStock { get; set; }
    public int NewStock { get; set; }
    public string? Reason { get; set; }
    public string? ReferenceNumber { get; set; } // OrderId, etc.
    public Guid? ReferenceId { get; set; }
    public DateTime MovementDate { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public virtual Product Product { get; set; } = null!;
    public virtual Warehouse? Warehouse { get; set; }
}