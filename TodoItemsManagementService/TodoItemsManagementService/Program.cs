using Microsoft.EntityFrameworkCore;
using TodoItemsManagementService;
using TodoItemsManagementService.Model;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddDbContext<TodoDbContext>(opt => opt.UseInMemoryDatabase("TodoItems"));
builder.Services.AddDatabaseDeveloperPageExceptionFilter();
builder.Services.AddCors();
var app = builder.Build();
app.UseDefaultFiles();
app.UseStaticFiles();
app.UseCors(builder => builder
.AllowAnyOrigin()
.AllowAnyMethod()
.AllowAnyHeader()
);
var urlGroup = app.MapGroup("/todoitems");

urlGroup.MapGet("/", async (TodoDbContext db) =>
await db.Items.ToListAsync());

urlGroup.MapPost("/", async (TodoItem todoItem, TodoDbContext db) =>
{
    db.Items.Add(todoItem);
    await db.SaveChangesAsync();

    return Results.Created($"/todoitems/{todoItem.Id}", todoItem);
});

urlGroup.MapPut("/{id}", async (int id, TodoItem inputItem, TodoDbContext db) =>
{
    var todo = await db.Items.FindAsync(id);
    if (todo is null) return Results.NotFound();
    todo.Name = inputItem.Name;
    todo.Done = inputItem.Done;

    await db.SaveChangesAsync();

    return Results.NoContent();
});

urlGroup.MapDelete("/{id}", async (int id, TodoDbContext db) =>
{
    if (await db.Items.FindAsync(id) is TodoItem item)
    {
        db.Items.Remove(item);
        await db.SaveChangesAsync();
        return Results.NoContent();
    }
    return Results.NotFound();
});

app.Run();
