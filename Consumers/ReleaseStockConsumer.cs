using MassTransit;
using Nexus.Services.Inventory.Services;
using Nexus.Shared.Contracts.Commands;
using Nexus.Shared.Contracts.Events;

namespace Nexus.Services.Inventory.Consumers;

public class ReleaseStockConsumer : IConsumer<ReleaseStockCommand>
{
    private readonly IInventoryService _inventoryService;
    private readonly ILogger<ReleaseStockConsumer> _logger;

    public ReleaseStockConsumer(
        IInventoryService inventoryService,
        ILogger<ReleaseStockConsumer> logger)
    {
        _inventoryService = inventoryService;
        _logger = logger;
    }

    public async Task Consume(ConsumeContext<ReleaseStockCommand> context)
    {
        var command = context.Message;

        try
        {
            _logger.LogInformation("Processing ReleaseStockCommand for Order: {OrderId}, Reason: {Reason}",
                command.OrderId, command.Reason);

            var releasedItems = new List<OrderItem>();

            foreach (var item in command.Items)
            {
                try
                {
                    await _inventoryService.ReleaseStockAsync(
                        item.ProductId,
                        item.Quantity,
                        $"Order-{command.OrderId}-Release-{command.Reason}");

                    releasedItems.Add(item);

                    _logger.LogInformation("Stock released: Product {ProductId}, Quantity {Quantity}",
                        item.ProductId, item.Quantity);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error releasing stock for Product {ProductId}", item.ProductId);
                    // Continue with other items even if one fails
                }
            }

            // Publish stock released event
            await context.Publish(new StockReleasedEvent
            {
                OrderId = command.OrderId,
                Reason = command.Reason,
                ReleasedItems = releasedItems
            });

            _logger.LogInformation("Stock release completed for Order: {OrderId}, Released {Count} items",
                command.OrderId, releasedItems.Count);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error processing ReleaseStockCommand for Order: {OrderId}",
                command.OrderId);
            throw;
        }
    }
}