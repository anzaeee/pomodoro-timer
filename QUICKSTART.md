# Quick Start Guide

## Prerequisites

- Docker and Docker Compose installed
- Node.js 18+ (for local development without Docker)

## Running with Docker (Recommended)

1. **Start all services:**
   ```bash
   docker-compose up --build
   ```

2. **Access the application:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - Database: localhost:5432

3. **Stop services:**
   ```bash
   docker-compose down
   ```

## Local Development

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your database URL and JWT secret
   ```

4. **Set up database:**
   ```bash
   # Make sure PostgreSQL is running
   npx prisma migrate dev
   npx prisma generate
   ```

5. **Start development server:**
   ```bash
   npm run dev
   ```

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm start
   ```

   The app will open at http://localhost:3000

## Database Management

### Using Prisma Studio

```bash
cd backend
npm run prisma:studio
```

This opens Prisma Studio at http://localhost:5555 where you can view and edit your database.

### Running Migrations

```bash
cd backend
npm run prisma:migrate  # Development
npm run prisma:deploy   # Production
```

## Features

- ⏱️ Pomodoro Timer (25/5/15 minute intervals)
- 🔐 User Authentication (optional)
- 💾 Save Preferences (work/break durations, auto-start, etc.)
- 📱 Progressive Web App (installable on mobile)
- 🎨 Material Design UI

## Environment Variables

### Backend (.env)
```
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"
JWT_SECRET="your-secret-key"
PORT=5000
NODE_ENV=development
```

### Frontend
Set `REACT_APP_API_URL` in your environment or build process to point to your backend API.

## Troubleshooting

### Database Connection Issues
- Ensure PostgreSQL is running
- Check DATABASE_URL in backend/.env
- Verify database credentials

### Port Conflicts
- Change ports in docker-compose.yml if 3000, 5000, or 5432 are in use
- Update REACT_APP_API_URL in frontend if backend port changes

### Prisma Issues
- Run `npx prisma generate` after schema changes
- Run `npx prisma migrate dev` to apply migrations

