using Microsoft.EntityFrameworkCore;
using TodoItemsManagementService.Model;

namespace TodoItemsManagementService.DB
{
    public class TodoDbContext : DbContext
    {

        public TodoDbContext(DbContextOptions<TodoDbContext> options) : base(options) {
            Database.EnsureCreated();
        }

        public DbSet<TodoItem> Items => Set<TodoItem>();
    }
}
