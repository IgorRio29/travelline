using Microsoft.EntityFrameworkCore;
using TodoItemsManagementService.Model;

namespace TodoItemsManagementService
{
    public class TodoDbContext : DbContext
    {

        public TodoDbContext(DbContextOptions<TodoDbContext> options) : base(options) { }

        public DbSet<TodoItem> Items => Set<TodoItem>();
    }
}
