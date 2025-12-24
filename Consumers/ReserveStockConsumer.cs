using MassTransit;
using Nexus.Services.Inventory.Services;
using Nexus.Shared.Contracts.Commands;
using Nexus.Shared.Contracts.Events;

namespace Nexus.Services.Inventory.Consumers;

public class ReserveStockConsumer : IConsumer<ReserveStockCommand>
{
    private readonly IInventoryService _inventoryService;
    private readonly ILogger<ReserveStockConsumer> _logger;
    private readonly IPublishEndpoint _publishEndpoint;

    public ReserveStockConsumer(
        IInventoryService inventoryService,
        ILogger<ReserveStockConsumer> logger,
        IPublishEndpoint publishEndpoint)
    {
        _inventoryService = inventoryService;
        _logger = logger;
        _publishEndpoint = publishEndpoint;
    }

    public async Task Consume(ConsumeContext<ReserveStockCommand> context)
    {
        var command = context.Message;

        try
        {
            _logger.LogInformation("Processing ReserveStockCommand for Order: {OrderId}",
                command.OrderId);

            var reservedItems = new List<ReservedItem>();
            var failedReservations = new List<string>();

            foreach (var item in command.Items)
            {
                try
                {
                    // Check stock availability
                    var isAvailable = await _inventoryService.CheckStockAvailabilityAsync(
                        item.ProductId, item.Quantity);

                    if (isAvailable)
                    {
                        // Reserve stock
                        await _inventoryService.ReserveStockAsync(
                            item.ProductId,
                            item.Quantity,
                            $"Order-{command.OrderId}");

                        reservedItems.Add(new ReservedItem
                        {
                            ProductId = item.ProductId,
                            ReservedQuantity = item.Quantity,
                            UnitPrice = item.UnitPrice
                        });

                        _logger.LogInformation("Stock reserved: Product {ProductId}, Quantity {Quantity}",
                            item.ProductId, item.Quantity);
                    }
                    else
                    {
                        failedReservations.Add($"Product {item.ProductId}: Insufficient stock");
                        _logger.LogWarning("Insufficient stock for Product {ProductId}, Requested: {Quantity}",
                            item.ProductId, item.Quantity);
                    }
                }
                catch (Exception ex)
                {
                    failedReservations.Add($"Product {item.ProductId}: {ex.Message}");
                    _logger.LogError(ex, "Error reserving stock for Product {ProductId}", item.ProductId);
                }
            }

            if (failedReservations.Any() && reservedItems.Count == 0)
            {
                // All reservations failed
                await _publishEndpoint.Publish(new StockReservedEvent
                {
                    OrderId = command.OrderId,
                    Success = false,
                    Reason = $"Failed to reserve stock: {string.Join("; ", failedReservations)}",
                    ReservedItems = new List<ReservedItem>()
                });

                _logger.LogWarning("All stock reservations failed for Order {OrderId}", command.OrderId);
            }
            else if (failedReservations.Any())
            {
                // Partial success
                await _publishEndpoint.Publish(new StockReservedEvent
                {
                    OrderId = command.OrderId,
                    Success = true,
                    Reason = $"Partial reservation: {string.Join("; ", failedReservations)}",
                    ReservedItems = reservedItems
                });

                _logger.LogInformation("Partial stock reservation for Order {OrderId}: {SuccessCount} successful, {FailedCount} failed",
                    command.OrderId, reservedItems.Count, failedReservations.Count);
            }
            else
            {
                // Complete success
                await _publishEndpoint.Publish(new StockReservedEvent
                {
                    OrderId = command.OrderId,
                    Success = true,
                    Reason = "All stock reserved successfully",
                    ReservedItems = reservedItems
                });

                _logger.LogInformation("All stock reserved successfully for Order {OrderId}", command.OrderId);
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error processing ReserveStockCommand for Order: {OrderId}",
                command.OrderId);

            // Publish failure event
            await _publishEndpoint.Publish(new StockReservedEvent
            {
                OrderId = command.OrderId,
                Success = false,
                Reason = $"Failed to process reservation: {ex.Message}",
                ReservedItems = new List<ReservedItem>()
            });
        }
    }
}