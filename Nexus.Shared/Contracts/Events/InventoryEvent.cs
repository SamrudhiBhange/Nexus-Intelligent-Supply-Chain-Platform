namespace Nexus.Shared.Contracts.Events;

public class StockReservedEvent : IntegrationEvent
{
    public Guid OrderId { get; set; }
    public bool Success { get; set; }
    public string? Reason { get; set; }
    public List<ReservedItem> ReservedItems { get; set; } = new();
}

public class StockReleasedEvent : IntegrationEvent
{
    public Guid OrderId { get; set; }
    public string Reason { get; set; } = string.Empty;
    public List<OrderItem> ReleasedItems { get; set; } = new();
}

public class ReservedItem
{
    public Guid ProductId { get; set; }
    public int ReservedQuantity { get; set; }
    public decimal UnitPrice { get; set; }
}