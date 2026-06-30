# Marvel Cinema - Movie Booking Management System 🎬

A modern, full-stack web application designed for seamless movie ticket booking and cinema administration. Built with an ASP.NET Core Clean Architecture backend and a highly dynamic, visually stunning React (Vite) frontend.

---

## ✨ Features

### 👤 Customer Experience
* **Dynamic Movie Browsing:** Browse now showing and upcoming movies with beautiful cover images and trailers.
* **Interactive Seat Selection:** Book tickets via an interactive, color-coded seating grid.
* **Smart Booking Management:** View detailed booking history, upcoming showtimes, and easily cancel tickets.
* **Cinematic E-Tickets:** Generate, preview, and download highly polished PDF movie tickets directly from the browser.
* **Support Inquiries:** Submit queries directly to the cinema administration.

### 🛡️ Admin Dashboard
* **Full CRUD Management:** Easily manage Movies, Cinema Halls, Showtimes, and Users.
* **Real-time Analytics:** View financial reports, occupancy rates, and sales data in graphical format.
* **Inquiry Management:** Read and reply to customer support requests via a built-in messaging flow.
* **System Settings:** Configure application-wide settings dynamically.

---

## 🛠️ Technology Stack

### Backend
* **Framework:** .NET 10 Web API
* **Architecture:** Clean Architecture (Domain, Application, Infrastructure, API layers)
* **ORM:** Entity Framework Core
* **Database:** SQL Server / LocalDB
* **Authentication:** JWT (JSON Web Tokens)
* **API Documentation:** Swagger / OpenAPI

### Frontend
* **Framework:** React 18 + Vite + TypeScript
* **Styling:** Tailwind CSS + Vanilla CSS (for layout)
* **UI Components:** Material-UI (MUI)
* **Icons:** Material Icons
* **PDF Generation:** html2canvas & html2pdf.js
* **State Management:** React Context API

---

## 🚀 Getting Started

### Prerequisites
* [Node.js](https://nodejs.org/) (v18 or higher)
* [.NET 10 SDK](https://dotnet.microsoft.com/download)
* SQL Server Express or LocalDB

### 1. Backend Setup (.NET)
1. Navigate to the API directory:
   ```bash
   cd backend/src/MovieBookingManagement.API
   ```
2. Restore NuGet dependencies and apply database migrations:
   ```bash
   dotnet restore
   dotnet ef database update --project ../MovieBookingManagement.Infrastructure
   ```
3. Start the API server:
   ```bash
   dotnet run
   # OR
   dotnet watch run
   ```
   *The API will start at `http://localhost:5068`. You can view the Swagger documentation at `http://localhost:5068/swagger`.*

### 2. Frontend Setup (React/Vite)
1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend/marvel
   ```
2. Install NPM dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   *The frontend will be accessible at `http://localhost:5173`.*

---

## 🏗️ Architecture Overview
The backend strictly adheres to **Clean Architecture** principles, separating concerns into distinct layers:
1. **Domain:** Enterprise logic and entities (e.g., `Movie`, `Booking`, `User`).
2. **Application:** Business logic, interfaces, and CQRS handlers (e.g., `IMovieService`, `BookingService`).
3. **Infrastructure:** External concerns like Database access (`ApplicationDbContext`), file storage, and email services.
4. **API (Presentation):** ASP.NET Core Controllers routing HTTP requests to the Application layer.

---

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/Vishagan-CST/MovieBookingManagementSystem/issues).
