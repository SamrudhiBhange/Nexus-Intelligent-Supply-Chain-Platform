using Microsoft.EntityFrameworkCore;
using Nexus.Services.Identity.Data;

namespace Nexus.Services.Identity.Helpers;

public static class DatabaseHelper
{
    public static async Task EnsureDatabaseAsync(WebApplication app)
    {
        using var scope = app.Services.CreateScope();
        var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

        try
        {
            // Check if database exists
            if (await dbContext.Database.CanConnectAsync())
            {
                // Database exists, apply migrations
                await dbContext.Database.MigrateAsync();
                Console.WriteLine("Database migrated successfully.");
            }
            else
            {
                // Create database
                await dbContext.Database.EnsureCreatedAsync();
                Console.WriteLine("Database created successfully.");
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Database error: {ex.Message}");

            // If there's an error, try to recreate the database
            try
            {
                await dbContext.Database.EnsureDeletedAsync();
                await dbContext.Database.EnsureCreatedAsync();
                Console.WriteLine("Database recreated successfully.");
            }
            catch (Exception ex2)
            {
                Console.WriteLine($"Failed to recreate database: {ex2.Message}");
                throw;
            }
        }
    }
}