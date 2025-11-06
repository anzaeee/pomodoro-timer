# Docker Setup Guide

## Prerequisites

1. **Install Docker Desktop** (includes Docker Compose)
   - macOS: Download from https://www.docker.com/products/docker-desktop
   - Linux: Follow instructions at https://docs.docker.com/engine/install/
   - Windows: Download Docker Desktop for Windows

2. **Verify Installation**
   ```bash
   docker --version
   docker compose version  # or docker-compose --version
   ```

3. **Start Docker Desktop**
   - Make sure Docker Desktop is running
   - Check with: `docker ps`

## Quick Start

```bash
# 1. Navigate to project directory
cd pomodoro-timer

# 2. Start all services
docker compose up --build

# 3. Access the application
# Frontend: http://localhost:3000
# Backend: http://localhost:5000
```

## Services

### Database (PostgreSQL)
- **Container**: `pomodoro-db`
- **Port**: `5432`
- **Database**: `pomodoro_db`
- **User**: `pomodoro_user`
- **Password**: `pomodoro_password`

### Backend (Node.js/Express)
- **Container**: `pomodoro-backend`
- **Port**: `5000`
- **Environment**: Production
- **Logs**: Stored in `logs/` directory

### Frontend (React/Nginx)
- **Container**: `pomodoro-frontend`
- **Port**: `3000`
- **Served by**: Nginx

## Common Commands

```bash
# Start services
docker compose up -d

# Stop services
docker compose down

# View logs
docker compose logs -f

# Rebuild after code changes
docker compose up --build

# Remove all containers and volumes
docker compose down -v

# Execute command in container
docker compose exec backend npm run prisma:studio
docker compose exec database psql -U pomodoro_user -d pomodoro_db
```

## Troubleshooting

### Docker daemon not running
```bash
# Start Docker Desktop application
# On macOS: Open Docker Desktop from Applications
# On Linux: sudo systemctl start docker
```

### Port already in use
```bash
# Check what's using the port
lsof -i :3000
lsof -i :5000
lsof -i :5432

# Stop conflicting services or change ports in docker-compose.yml
```

### Database connection issues
```bash
# Check database container status
docker compose ps

# View database logs
docker compose logs database

# Restart database
docker compose restart database
```

### Rebuild after dependency changes
```bash
# Rebuild without cache
docker compose build --no-cache

# Rebuild specific service
docker compose build --no-cache backend
```

## Environment Variables

Default values are set in `docker-compose.yml`. To override:

1. Create `.env` file in project root
2. Add environment variables:
   ```env
   DATABASE_URL=postgresql://pomodoro_user:pomodoro_password@database:5432/pomodoro_db
   JWT_SECRET=your-secret-key
   NODE_ENV=production
   DEPLOYMENT_ENV=development
   ```

## Volumes

- **postgres_data**: Persistent database storage
- **./backend**: Backend code (for development)
- **./logs**: Application logs

## Production Deployment

For production, consider:
- Using environment-specific docker-compose files
- Setting secure JWT_SECRET
- Using external database
- Configuring proper logging paths
- Setting up SSL/TLS certificates

