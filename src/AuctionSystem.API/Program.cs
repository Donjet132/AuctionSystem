using AuctionSystem.Persistence;
using Microsoft.EntityFrameworkCore;
using MediatR;
using System.Reflection;
using FluentValidation;
using FluentValidation.AspNetCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddMediatR(cfg =>
    cfg.RegisterServicesFromAssembly(typeof(AuctionSystem.Application.Users.Commands.RegisterUserCommand).Assembly));

builder.Services.AddValidatorsFromAssembly(typeof(AuctionSystem.Application.Users.Commands.RegisterUserCommandValidator).Assembly);

builder.Services.AddTransient(typeof(IPipelineBehavior<,>), typeof(AuctionSystem.Application.Common.Behaviors.ValidationBehavior<,>));


var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.MapControllers();

app.Run();
