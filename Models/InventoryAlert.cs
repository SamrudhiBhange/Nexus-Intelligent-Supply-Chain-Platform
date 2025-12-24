using Nexus.BuildingBlocks.Common;

namespace Nexus.Services.Inventory.Models;

public class InventoryAlert : BaseEntity
{
    public Guid ProductId { get; set; }
    public string AlertType { get; set; } = string.Empty; // LOW_STOCK, OUT_OF_STOCK, OVER_STOCK
    public string Message { get; set; } = string.Empty;
    public bool IsResolved { get; set; } = false;
    public DateTime? ResolvedAt { get; set; }
    public string? ResolvedBy { get; set; }

    // Navigation properties
    public virtual Product Product { get; set; } = null!;
}