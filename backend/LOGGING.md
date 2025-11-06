# Logging Configuration

## Overview
The application uses Winston for centralized, deployment-based logging. All logs are stored in a single location organized by deployment environment.

## Log Directory Structure
```
logs/
└── pomodoro-timer/
    ├── development/
    │   ├── app-2024-01-01.log
    │   ├── error-2024-01-01.log
    │   ├── exceptions-2024-01-01.log
    │   └── rejections-2024-01-01.log
    ├── staging/
    │   └── ...
    └── production/
        └── ...
```

## Environment Variables
- `DEPLOYMENT_ENV`: Deployment environment (development, staging, production). Defaults to `NODE_ENV` or 'development'
- `DEPLOYMENT_NAME`: Deployment name. Defaults to 'pomodoro-timer'
- `LOGS_DIR`: Base directory for logs. Defaults to `../../logs` (project root)
- `LOG_LEVEL`: Logging level (error, warn, info, debug). Defaults to 'info'

## Log Files
- **app-{DATE}.log**: All application logs (info level and above)
- **error-{DATE}.log**: Error logs only
- **exceptions-{DATE}.log**: Unhandled exceptions
- **rejections-{DATE}.log**: Unhandled promise rejections

## Log Retention
- Application logs: 14 days
- Error logs: 30 days
- Exception/Rejection logs: 30 days
- Max file size: 20MB per file

## What Gets Logged
- Server startup/shutdown
- User registration and login
- Preferences and preset updates
- Errors and exceptions
- Request paths (non-health check in production)

## What Doesn't Get Logged
- Health check requests (in development)
- Routine GET requests for preferences/presets
- Successful authentication checks

