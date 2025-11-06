# Pomodoro Timer PWA

A Progressive Web Application for Pomodoro timer with user authentication and preferences storage.

## Tech Stack

- **Frontend**: React with Material-UI (MUI), PWA capabilities
- **Backend**: Node.js with Express
- **Database**: PostgreSQL with Prisma ORM
- **Containerization**: Docker & Docker Compose

## Project Structure

```
pomodoro-timer/
├── frontend/          # React PWA application
├── backend/           # Node.js/Express API
├── database/          # Prisma schema and migrations
├── docker-compose.yml # Docker compose configuration
└── .gitlab-ci.yml     # GitLab CI/CD pipeline
```

## Getting Started

### Prerequisites

- Docker and Docker Compose
- Node.js 18+ (for local development)

### Running with Docker

```bash
docker-compose up --build
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- PostgreSQL: localhost:5432

### Local Development

#### Backend
```bash
cd backend
npm install
npm run dev
```

#### Frontend
```bash
cd frontend
npm install
npm start
```

## Features

- ⏱️ Pomodoro timer (25/5/15 minute intervals)
- 🔐 Optional user authentication
- 💾 Save preferences (work/break durations)
- 📱 Progressive Web App (mobile-ready)
- 🎨 Material Design UI

