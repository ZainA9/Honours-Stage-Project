# EventFinder – Full Stack Web App

EventFinder is a full-stack event discovery and RSVP web application that allows users to explore, create, and manage local events. It uses a .NET backend with MongoDB, and a Vite-powered React frontend with Mapbox integration.

---

## 📁 Project Structure

Honours-Stage-Project-Clean/
├── Backend.Tests/ # Unit tests (xUnit)
├── EventFinderAPI/ # ASP.NET Core Web API
│ ├── appsettings.json.example # Example backend config
│ ├── Controllers/ # API endpoints
│ └── Models/, Services/, etc.
├── Frontend/ # React + Vite frontend
│ ├── .env.example # Example frontend config
│ └── src/, public/, components/
├── database/ # Sample MongoDB dataset
│ ├── users.json
│ ├── events.json
├── credentials.txt # Real secrets for local testing (Mapbox, Mailjet)
├── README.md # This file
└── EventFinderAPI.sln # Solution file



## 🛠 Requirements

- [.NET 6+ SDK](https://dotnet.microsoft.com/)
- [Node.js + npm](https://nodejs.org/)
- [MongoDB (local)](https://www.mongodb.com/try/download/community)

---

## 🚀 How to Run the Application

### 🧩 1. Import the Sample Database

Ensure MongoDB is running on your local machine (port `27017`).

Then import the included sample data using:

```bash
mongoimport --db EventFinder --collection Events --file database/events.json
mongoimport --db EventFinder --collection Users --file database/users.json
🖥️ 2. Run the Backend (ASP.NET Core API)
Open EventFinderAPI.sln in Visual Studio 2022

Copy appsettings.json.example to appsettings.json

Copy appsettings.Development.json.example to appsettings.Development.json

Paste the real credentials from credentials.txt into the new files

Press Ctrl + F5 or use F5 (Debug) to launch

By default, the API runs on:

http://localhost:5000
🌐 3. Run the Frontend (React + Vite)
Navigate to the frontend folder:
cd Frontend
Copy .env.example to .env and insert your real Mapbox token (from credentials.txt):
VITE_MAPBOX_TOKEN=your_real_mapbox_token_here
Then install and start:
npm install
npm run dev
Vite should launch the app at:
http://localhost:5173
🔑 Credentials
The file credentials.txt (included only in the ZIP) contains:

Mapbox API token

Mailjet SMTP credentials

JWT secret key

Use these to populate .env, appsettings.json, and appsettings.Development.json.

⚠️ These are not included on GitHub for security reasons.

🧪 Testing
Backend unit tests are located in the Backend.Tests/ folder.

You can run tests via Test Explorer in Visual Studio.

✅ Notes
Ensure MongoDB is running before launching the backend.

Frontend MapView depends on the Mapbox token.

Email confirmations use the Mailjet SMTP service (set up in SmtpEmailService.cs).

📎 GitHub Repo
This repo includes:

Full frontend code

All example config files (.env.example, appsettings.json.example)

Real config files are excluded for security

ZIP version contains the real .env, appsettings.json, and credentials.txt for testing.

---
