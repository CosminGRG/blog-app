# blog-app
Blog Application made using an ASP.NET Core API backend with a React client front end and MSSQL

## Overview
BlogApp is a web application built with ASP.NET Core API, React (using Vite), MSSQL, and Entity Framework Core. It allows admins to manage blog posts and tags, while users can filter and search posts, register, log in, and leave comments.

### Features
- Create Posts
- Update Posts
- Delete Posts
- Manage Tags
- JWT User Registration and Login
- Leave Comments
- Filter Posts by Tags
- Search Posts

### Technologies Used
- ASP.NET Core API
- React w/ Vite
- MSSQL
- Entity Framework Core

## Getting Started

### Prerequisites
- .NET 8.0 SDK or later
- npm
- SQL Server or SQL Server Express
- Visual Studio Code

### Installation
1. Clone the repository: `git clone https://github.com/CosminGRG/blog-app.git`
2. Open the project in VSCode
3. Navigate to blog-app/api/blog-app-api/
4. Configure the database connection:
    - In VSCode, open the `appsettings.json` file located in the `blog-app-api` directory
    - Update the connection string to point to your MSSQL database
5. Configure JWT settings:
    - In `appsettings.json`, add your JWT settings such as Issuer, Audience, and SecretKey
6. Apply Migrations and Seed Data:
    - Open a terminal in VSCode and navigate to `/blog-app-api`
    - Run the following command `dotnet ef database update`
7. Run the backend API:
    - In the terminal, run the following command: `dotnet run`
8. Navigate to the frontend project:
    - Open a terminal in VSCode and navigate to `/blog-app`
9. Install dependencies:
    - In the terminal, run the following command: `npm install`
10. Configure API URL:
    - In VSCode, open the `vite.config.js` file located in the `/blog-app` directory.
    - Ensure the API base URL is set correctly to `https://localhost:5000`.
11. Run the React client:
    - In the terminal, run the following command: `npm run dev`
