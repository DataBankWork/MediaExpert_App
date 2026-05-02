using Microsoft.EntityFrameworkCore;
using MediaExpert_App.Server.Models;

namespace MediaExpert_App.Server.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Product> Products { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        var products = new List<Product>();

        for (int i = 1; i <= 100; i++)
        {
            products.Add(new Product
            {
                Id = i,
                Code = $"P-{1000 + i}",
                Name = $"Product Number {i}",
                Price = Math.Round(10.50m * i, 2) // Przykładowa cena
            });
        }

        modelBuilder.Entity<Product>().HasData(products);
    }

}