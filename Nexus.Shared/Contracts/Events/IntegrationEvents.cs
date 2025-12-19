namespace Nexus.Shared.Contracts.Events;

public abstract class IntegrationEvent
{
    public Guid EventId { get; } = Guid.NewGuid();
    public DateTime OccurredOn { get; } = DateTime.UtcNow;
}

// Identity Events
public class UserRegisteredEvent : IntegrationEvent
{
    public Guid UserId { get; set; }
    public string Email { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
}

public class UserLoggedInEvent : IntegrationEvent
{
    public Guid UserId { get; set; }
    public string Email { get; set; } = string.Empty;
    public DateTime LoginTime { get; set; }
}

// Inventory Events
public class ProductCreatedEvent : IntegrationEvent
{
    public Guid ProductId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Sku { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public int InitialStock { get; set; }
    public string? Category { get; set; }
}

public class StockUpdatedEvent : IntegrationEvent
{
    public Guid ProductId { get; set; }
    public int OldQuantity { get; set; }
    public int NewQuantity { get; set; }
    public string Reason { get; set; } = string.Empty;
    public Guid? OrderId { get; set; }
    public Guid? ReferenceId { get; set; }
}

public class LowStockAlertEvent : IntegrationEvent
{
    public Guid ProductId { get; set; }
    public string ProductName { get; set; } = string.Empty;
    public string Sku { get; set; } = string.Empty;
    public int CurrentStock { get; set; }
    public int ReorderLevel { get; set; }
    public string AlertMessage { get; set; } = string.Empty;
}

public class OutOfStockEvent : IntegrationEvent
{
    public Guid ProductId { get; set; }
    public string ProductName { get; set; } = string.Empty;
    public string Sku { get; set; } = string.Empty;
    public DateTime OutOfStockTime { get; set; }
}

// Order Events
public class OrderCreatedEvent : IntegrationEvent
{
    public Guid OrderId { get; set; }
    public Guid CustomerId { get; set; }
    public List<OrderItem> Items { get; set; } = new();
    public decimal TotalAmount { get; set; }
    public string ShippingAddress { get; set; } = string.Empty;
    public string CustomerEmail { get; set; } = string.Empty;
    public string CustomerName { get; set; } = string.Empty;
}

public class OrderItem
{
    public Guid ProductId { get; set; }
    public string ProductName { get; set; } = string.Empty;
    public string Sku { get; set; } = string.Empty;
    public int Quantity { get; set; }
    public decimal UnitPrice { get; set; }
    public decimal LineTotal => Quantity * UnitPrice;
}

public class OrderStatusChangedEvent : IntegrationEvent
{
    public Guid OrderId { get; set; }
    public string OldStatus { get; set; } = string.Empty;
    public string NewStatus { get; set; } = string.Empty;
    public string? Notes { get; set; }
    public DateTime ChangedAt { get; set; }
}

public class OrderShippedEvent : IntegrationEvent
{
    public Guid OrderId { get; set; }
    public Guid ShipmentId { get; set; }
    public string TrackingNumber { get; set; } = string.Empty;
    public DateTime ShippedAt { get; set; }
    public DateTime EstimatedDelivery { get; set; }
    public string Carrier { get; set; } = string.Empty;
}

public class OrderDeliveredEvent : IntegrationEvent
{
    public Guid OrderId { get; set; }
    public DateTime DeliveredAt { get; set; }
    public string DeliveryNotes { get; set; } = string.Empty;
}

public class OrderCancelledEvent : IntegrationEvent
{
    public Guid OrderId { get; set; }
    public string Reason { get; set; } = string.Empty;
    public DateTime CancelledAt { get; set; }
    public Guid CancelledBy { get; set; }
}

// Payment Events
public class PaymentProcessedEvent : IntegrationEvent
{
    public Guid OrderId { get; set; }
    public Guid PaymentId { get; set; }
    public bool Success { get; set; }
    public string TransactionId { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public string PaymentMethod { get; set; } = string.Empty;
    public DateTime ProcessedAt { get; set; }
}

// Notification Events
public class NotificationCreatedEvent : IntegrationEvent
{
    public Guid NotificationId { get; set; }
    public Guid UserId { get; set; }
    public string Type { get; set; } = string.Empty; // ORDER, SHIPMENT, SYSTEM, ALERT
    public string Title { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public bool IsRead { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class EmailSentEvent : IntegrationEvent
{
    public string To { get; set; } = string.Empty;
    public string Subject { get; set; } = string.Empty;
    public string Body { get; set; } = string.Empty;
    public bool Success { get; set; }
    public string? ErrorMessage { get; set; }
}

// Shipping Events
public class ShipmentCreatedEvent : IntegrationEvent
{
    public Guid ShipmentId { get; set; }
    public Guid OrderId { get; set; }
    public string TrackingNumber { get; set; } = string.Empty;
    public string Carrier { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}

public class ShipmentStatusUpdatedEvent : IntegrationEvent
{
    public Guid ShipmentId { get; set; }
    public string OldStatus { get; set; } = string.Empty;
    public string NewStatus { get; set; } = string.Empty;
    public DateTime UpdatedAt { get; set; }
    public string? Location { get; set; }
    public string? Notes { get; set; }
}