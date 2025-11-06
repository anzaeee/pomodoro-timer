# Pomodoro Timer PWA

A Progressive Web Application (PWA) for Pomodoro timer with user authentication, custom presets, and persistent preferences. Built with React, Node.js, and PostgreSQL.

## 🚀 Features

- ⏱️ **Pomodoro Timer**: Classic 25/5/15 minute intervals with customizable durations
- 🔐 **User Authentication**: Optional signup/login to save preferences
- 💾 **Custom Presets**: Save up to 3 custom timer configurations per user
- 📱 **Progressive Web App**: Mobile-ready with offline support
- 🎨 **Material Design UI**: Beautiful pastel purple/blue theme with smooth animations
- 🔔 **Auto-start Breaks**: Automatically start break timers when work sessions complete
- 📊 **Pomodoro Counter**: Track completed work sessions
- 🎯 **Custom Timer Mode**: Temporary custom durations for testing (authenticated users only)
- 📝 **Persistent Logging**: Deployment-based centralized logging system
- 🧪 **Test Coverage**: Unit tests for backend and frontend components

## 🛠️ Tech Stack

### Frontend
- **React 18** with Material-UI (MUI)
- **Tailwind CSS** for utility-first styling
- **React Router** for navigation
- **Axios** for API calls
- **PWA** capabilities with service worker

### Backend
- **Node.js** with Express
- **PostgreSQL** database
- **Prisma ORM** for database management
- **JWT** for authentication
- **Winston** for centralized logging
- **Bcrypt** for password hashing

### DevOps
- **Docker** & **Docker Compose** for containerization
- **GitLab CI/CD** for automated deployments
- **Nginx** for frontend serving

## 📁 Project Structure

```
pomodoro-timer/
├── frontend/                 # React PWA application
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/           # Page components
│   │   ├── context/         # React context providers
│   │   └── __tests__/       # Frontend tests
│   ├── public/              # Static assets & PWA files
│   └── Dockerfile           # Frontend Docker image
├── backend/                  # Node.js/Express API
│   ├── routes/              # API route handlers
│   ├── middleware/          # Express middleware
│   ├── utils/               # Utility functions (logger, etc.)
│   ├── prisma/              # Prisma schema & migrations
│   ├── __tests__/           # Backend tests
│   ├── logs/                # Application logs (gitignored)
│   └── Dockerfile           # Backend Docker image
├── docker-compose.yml        # Docker Compose configuration
├── .gitlab-ci.yml           # GitLab CI/CD pipeline
└── README.md                # This file
```

## 🚀 Quick Start

### Prerequisites

- **Docker** and **Docker Compose** (recommended)
  - Docker Desktop (includes Docker Compose) - https://www.docker.com/products/docker-desktop
  - OR install Docker Compose separately: https://docs.docker.com/compose/install/
- OR **Node.js 18+** and **PostgreSQL 15+** (for local development)

**Note**: Make sure Docker daemon is running before starting containers.

### Running with Docker (Recommended)

1. **Ensure Docker is running**
   ```bash
   # Check Docker status
   docker ps
   
   # If Docker daemon is not running, start Docker Desktop
   ```

2. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd pomodoro-timer
   ```

3. **Set up environment variables** (optional for development)
   ```bash
   # Backend .env file (optional - defaults are set in docker-compose.yml)
   cd backend
   # Create .env if you want to override defaults
   # DATABASE_URL, JWT_SECRET, etc.
   ```

4. **Start all services**
   ```bash
   # Using Docker Compose v2 (recommended)
   docker compose up --build
   
   # OR using Docker Compose v1
   docker-compose up --build
   
   # Run in detached mode
   docker compose up --build -d
   ```

5. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - Health Check: http://localhost:5000/api/health

6. **View logs**
   ```bash
   # All services
   docker compose logs -f
   
   # Specific service
   docker compose logs -f backend
   docker compose logs -f frontend
   docker compose logs -f database
   ```

7. **Stop services**
   ```bash
   docker compose down
   
   # Remove volumes (clears database)
   docker compose down -v
   ```

8. **Rebuild after changes**
   ```bash
   docker compose up --build
   ```

### Local Development (Without Docker)

#### Backend Setup

1. **Install dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Set up database**
   ```bash
   # Create .env file with DATABASE_URL
   # Example: DATABASE_URL="postgresql://user:password@localhost:5432/pomodoro_db"
   
   # Run migrations
   npm run prisma:migrate
   
   # Generate Prisma Client
   npm run prisma:generate
   ```

3. **Start backend server**
   ```bash
   npm run dev
   ```

#### Frontend Setup

1. **Install dependencies**
   ```bash
   cd frontend
   npm install
   ```

2. **Start development server**
   ```bash
   npm start
   ```

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
```env
DATABASE_URL=postgresql://user:password@localhost:5432/pomodoro_db
JWT_SECRET=your-super-secret-jwt-key-change-in-production
PORT=5000
NODE_ENV=development
DEPLOYMENT_ENV=development
DEPLOYMENT_NAME=pomodoro-timer
LOGS_DIR=./logs
LOG_LEVEL=info
```

#### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:5000
```

### Logging Configuration

Logs are stored in a centralized, deployment-based directory structure:
```
logs/
└── pomodoro-timer/
    ├── development/
    ├── staging/
    └── production/
```

See [backend/LOGGING.md](backend/LOGGING.md) for detailed logging configuration.

## 🧪 Testing

### Backend Tests
```bash
cd backend
npm test              # Run tests with coverage
npm run test:watch    # Watch mode
```

### Frontend Tests
```bash
cd frontend
npm test              # Run tests (no watch)
npm run test:watch    # Watch mode
```

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires auth)

### Preferences
- `GET /api/preferences` - Get user preferences (requires auth)
- `PUT /api/preferences` - Update user preferences (requires auth)

### Custom Presets
- `GET /api/presets` - Get all user presets (requires auth)
- `POST /api/presets` - Create new preset (requires auth, max 3)
- `PUT /api/presets/:id` - Update preset (requires auth)
- `DELETE /api/presets/:id` - Delete preset (requires auth)

### Health Check
- `GET /api/health` - API health status

## 🎨 UI Features

- **Bubble Timer**: Animated circular timer with smooth transitions
- **Mode Selection**: Dropdown to select Work/Short Break/Long Break
- **Custom Timer**: Temporary custom durations (authenticated users)
- **Settings Dialog**: Configure preferences and manage presets
- **Responsive Design**: Mobile-first design with Material-UI
- **Animations**: Smooth transitions and bubble animations when timer is active

## 📦 Deployment

### Docker Deployment

The application is containerized and ready for deployment. See [DOCKER.md](DOCKER.md) for detailed Docker setup instructions.

```bash
# Build and start
docker compose up --build -d

# View logs
docker compose logs -f

# Stop services
docker compose down
```

**Note**: Make sure Docker Desktop is running before starting containers.

### GitLab CI/CD

The project includes a GitLab CI/CD pipeline (`.gitlab-ci.yml`) that:
- Builds Docker images for backend and frontend
- Runs tests
- Deploys to staging/production environments

## 📊 Database Schema

- **User**: User accounts with email/password authentication
- **Preference**: User preferences (work/break durations, auto-start settings)
- **CustomPreset**: Up to 3 custom timer presets per user

See `backend/prisma/schema.prisma` for full schema details.

## 🔒 Security

- Passwords are hashed using bcrypt
- JWT tokens for authentication
- Input validation using express-validator
- CORS configured for API security

## 📄 License

ISC

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📞 Support

For issues and questions, please open an issue on the repository.

---

**Built with ❤️ using React, Node.js, and PostgreSQL**
