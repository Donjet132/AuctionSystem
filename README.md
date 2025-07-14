# 🧾 Auction System

A modern, full-stack Auction Management System built with **.NET 8 (Clean Architecture)**, **Angular 19 (Standalone APIs + NgRx)**, and **SQL Server**.

This application enables users to register, manage auctions, and place bids with role-based access control and a scalable, maintainable architecture using best practices and design patterns.

---

## 📦 Tech Stack

| Layer       | Technology / Tools                           |
|-------------|-----------------------------------------------|
| Frontend    | Angular 19 (Standalone API), NgRx, Material UI |
| Backend     | ASP.NET Core 8 (Clean Architecture)           |
| Patterns    | MediatR, CQRS, Dependency Injection           |
| ORM         | Entity Framework Core                         |
| Database    | SQL Server (MSSQL)                            |
| Auth        | JWT (JSON Web Tokens)                         |

---

## 🧠 Architecture Overview

### ✅ Backend: Clean Architecture

- **Application Layer**: Business logic, MediatR commands/queries
- **Domain Layer**: Entities, enums, core logic
- **Infrastructure Layer**: EF Core, repositories, external services
- **API Layer**: Controllers, validators, DI setup

> Uses **MediatR** for CQRS (Command Query Responsibility Segregation)  
> Integrated **FluentValidation**, **AutoMapper**, **Entity Framework Core**

### ✅ Frontend: Angular 19

- Built with **Standalone APIs** and **NgRx** for state management
- Material UI components
- Organized feature-based folder structure
- Typed models and API services

---

## 🚀 Features

- 🔐 JWT-based authentication & role-based access (Seller, Bidder)
- 📤 Auction creation and management (by Sellers)
- 💰 Real-time (manual refresh) bidding with highest bid tracking
- ✅ Client-side and server-side validation
- 🧼 Clean code and scalable architecture

## ⚙️ Setup

To run this project locally, follow these steps:

1. **Install required tools**:
   - [.NET 8 SDK](https://dotnet.microsoft.com/en-us/download)
   - [Node.js (v18 or newer)](https://nodejs.org/)
   - [Angular CLI](https://angular.io/cli)  
     Install with:
     ```bash
     npm install -g @angular/cli
     ```

2. **Clone the repository**:
   ```bash
   git clone https://github.com/Donjet132/AuctionSystem.git
   cd AuctionSystem
   
3. **Set up the database**:

    - Open AuctionSystemDb.sql in SQL Server Management Studio.
     
    - Execute it to create the database.
     
    - Then open WebAPI/appsettings.json and update the connection string:
        "ConnectionStrings": {
          "DefaultConnection": "Server=YOUR_SERVER;Database=AuctionSystemDb;Trusted_Connection=True;"
        }
    - Run migrations:
     ```bash
     dotnet ef database update

4. **Run the backend**:
```bash
  cd src\AuctionSystem.API
  dotnet run
 ```

5. **Run the frontend**:
```bash
  cd auction-ui
  npm install
  ng serve
 ```
