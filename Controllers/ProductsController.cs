using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Nexus.Services.Inventory.DTOs;
using Nexus.Services.Inventory.Models;
using Nexus.Services.Inventory.Services;
using Nexus.Shared.Contracts.DTOs;

namespace Nexus.Services.Inventory.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ProductsController : ControllerBase
{
    private readonly IInventoryService _inventoryService;
    private readonly ILogger<ProductsController> _logger;

    public ProductsController(
        IInventoryService inventoryService,
        ILogger<ProductsController> logger)
    {
        _inventoryService = inventoryService;
        _logger = logger;
    }

    [HttpPost]
    [Authorize(Roles = "Admin,Manager")]
    [ProducesResponseType(typeof(ApiResponse<ProductResponse>), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> CreateProduct([FromBody] CreateProductRequest request)
    {
        try
        {
            var product = await _inventoryService.CreateProductAsync(request);
            return CreatedAtAction(nameof(GetProduct), new { id = product.Id },
                ApiResponse<ProductResponse>.SuccessResponse(product, "Product created successfully"));
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ApiResponse<object>.ErrorResponse(ex.Message));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating product");
            return StatusCode(500, ApiResponse<object>.ErrorResponse("An error occurred while creating product"));
        }
    }

    [HttpGet("{id}")]
    [ProducesResponseType(typeof(ApiResponse<ProductResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetProduct(Guid id)
    {
        try
        {
            var product = await _inventoryService.GetProductAsync(id);
            return Ok(ApiResponse<ProductResponse>.SuccessResponse(product, "Product retrieved successfully"));
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(ApiResponse<object>.ErrorResponse(ex.Message));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving product: {ProductId}", id);
            return StatusCode(500, ApiResponse<object>.ErrorResponse("An error occurred while retrieving product"));
        }
    }

    [HttpGet]
    [ProducesResponseType(typeof(ApiResponse<PaginatedResponse<ProductResponse>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> SearchProducts([FromQuery] InventorySearchRequest request)
    {
        try
        {
            var result = await _inventoryService.SearchProductsAsync(request);
            return Ok(ApiResponse<PaginatedResponse<ProductResponse>>.SuccessResponse(result, "Products retrieved successfully"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error searching products");
            return StatusCode(500, ApiResponse<object>.ErrorResponse("An error occurred while searching products"));
        }
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin,Manager")]
    [ProducesResponseType(typeof(ApiResponse<ProductResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> UpdateProduct(Guid id, [FromBody] UpdateProductRequest request)
    {
        try
        {
            var product = await _inventoryService.UpdateProductAsync(id, request);
            return Ok(ApiResponse<ProductResponse>.SuccessResponse(product, "Product updated successfully"));
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(ApiResponse<object>.ErrorResponse(ex.Message));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating product: {ProductId}", id);
            return StatusCode(500, ApiResponse<object>.ErrorResponse("An error occurred while updating product"));
        }
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> DeleteProduct(Guid id)
    {
        try
        {
            await _inventoryService.DeleteProductAsync(id);
            return Ok(ApiResponse<object>.SuccessResponse(null, "Product deleted successfully"));
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(ApiResponse<object>.ErrorResponse(ex.Message));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting product: {ProductId}", id);
            return StatusCode(500, ApiResponse<object>.ErrorResponse("An error occurred while deleting product"));
        }
    }

    [HttpPost("{id}/stock")]
    [Authorize(Roles = "Admin,Manager")]
    [ProducesResponseType(typeof(ApiResponse<ProductResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> UpdateStock(Guid id, [FromBody] StockUpdateRequest request)
    {
        try
        {
            var product = await _inventoryService.UpdateStockAsync(id, request);
            return Ok(ApiResponse<ProductResponse>.SuccessResponse(product, "Stock updated successfully"));
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(ApiResponse<object>.ErrorResponse(ex.Message));
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ApiResponse<object>.ErrorResponse(ex.Message));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating stock for product: {ProductId}", id);
            return StatusCode(500, ApiResponse<object>.ErrorResponse("An error occurred while updating stock"));
        }
    }

    [HttpGet("{id}/stock-history")]
    [ProducesResponseType(typeof(ApiResponse<List<StockMovement>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetStockHistory(Guid id)
    {
        try
        {
            var history = await _inventoryService.GetProductStockHistoryAsync(id);
            return Ok(ApiResponse<List<StockMovement>>.SuccessResponse(history, "Stock history retrieved successfully"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving stock history for product: {ProductId}", id);
            return StatusCode(500, ApiResponse<object>.ErrorResponse("An error occurred while retrieving stock history"));
        }
    }

    [HttpGet("{id}/check-stock")]
    [ProducesResponseType(typeof(ApiResponse<bool>), StatusCodes.Status200OK)]
    public async Task<IActionResult> CheckStock(Guid id, [FromQuery] int quantity)
    {
        try
        {
            var isAvailable = await _inventoryService.CheckStockAvailabilityAsync(id, quantity);
            return Ok(ApiResponse<bool>.SuccessResponse(isAvailable, "Stock availability checked"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error checking stock for product: {ProductId}", id);
            return StatusCode(500, ApiResponse<object>.ErrorResponse("An error occurred while checking stock"));
        }
    }
}