using Microsoft.EntityFrameworkCore;
using Nexus.BuildingBlocks.Common;

namespace Nexus.BuildingBlocks.Infrastructure;

public abstract class BaseDbContext : DbContext
{
    protected BaseDbContext(DbContextOptions options) : base(options)
    {
    }

    public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        UpdateAuditableEntities();
        SoftDeleteEntities();
        return await base.SaveChangesAsync(cancellationToken);
    }

    public override int SaveChanges()
    {
        UpdateAuditableEntities();
        SoftDeleteEntities();
        return base.SaveChanges();
    }

    private void UpdateAuditableEntities()
    {
        var entries = ChangeTracker
            .Entries()
            .Where(e => e.Entity is BaseEntity &&
                       (e.State == EntityState.Added || e.State == EntityState.Modified));

        foreach (var entry in entries)
        {
            var entity = (BaseEntity)entry.Entity;
            var now = DateTime.UtcNow;

            if (entry.State == EntityState.Added)
            {
                entity.CreatedAt = now;
                entity.CreatedBy = GetCurrentUser();
            }
            else
            {
                entity.UpdatedAt = now;
                entity.UpdatedBy = GetCurrentUser();
            }
        }
    }

    private void SoftDeleteEntities()
    {
        var entries = ChangeTracker
            .Entries()
            .Where(e => e.Entity is BaseEntity && e.State == EntityState.Deleted);

        foreach (var entry in entries)
        {
            var entity = (BaseEntity)entry.Entity;
            entity.IsDeleted = true;
            entity.UpdatedAt = DateTime.UtcNow;
            entity.UpdatedBy = GetCurrentUser();
            entry.State = EntityState.Modified;
        }
    }

    protected virtual string GetCurrentUser()
    {
        // Default implementation
        return "system";
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        // Global query filters will be applied in entity configurations
    }
}