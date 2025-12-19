using Nexus.Shared.Contracts.Events;

namespace Nexus.Shared.Contracts.Commands;

public class ReserveStockCommand
{
    public Guid OrderId { get; set; }
    public Guid CorrelationId { get; set; }
    public List<OrderItem> Items { get; set; } = new();
    public DateTime RequestedAt { get; set; } = DateTime.UtcNow;
}

public class ReleaseStockCommand
{
    public Guid OrderId { get; set; }
    public Guid CorrelationId { get; set; }
    public List<OrderItem> Items { get; set; } = new();
    public string Reason { get; set; } = string.Empty;
    public DateTime RequestedAt { get; set; } = DateTime.UtcNow;
}

public class UpdateStockCommand
{
    public Guid ProductId { get; set; }
    public int Quantity { get; set; }
    public string AdjustmentType { get; set; } = string.Empty; // INCREMENT, DECREMENT, SET
    public string Reason { get; set; } = string.Empty;
    public Guid? ReferenceId { get; set; }
    public string? ReferenceNumber { get; set; }
}

public class CheckStockAvailabilityCommand
{
    public Guid OrderId { get; set; }
    public List<OrderItem> Items { get; set; } = new();
    public DateTime RequestedAt { get; set; } = DateTime.UtcNow;
}