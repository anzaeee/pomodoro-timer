const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { PrismaClient } = require('@prisma/client');
const logger = require('./utils/logger');

dotenv.config();

// Initialize Prisma Client
const prisma = new PrismaClient();

const app = express();
const PORT = process.env.PORT || 5000;

// Request logging middleware - only log errors and important events
app.use((req, res, next) => {
  // Only log non-health check requests in production
  if (req.path !== '/api/health' || process.env.NODE_ENV === 'production') {
    logger.info(`${req.method} ${req.path}`, {
      ip: req.ip,
      userAgent: req.get('user-agent'),
    });
  }
  next();
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/preferences', require('./routes/preferences'));
app.use('/api/presets', require('./routes/presets'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Pomodoro Timer API is running', 
    timestamp: new Date().toISOString(),
    deployment: logger.deployment,
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error('Unhandled error', {
    error: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });
  res.status(500).json({ message: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`, { 
    environment: process.env.NODE_ENV || 'development',
    deployment: logger.deployment,
    deploymentName: logger.deploymentName,
    logsDir: logger.logsDir,
  });
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, shutting down gracefully');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGINT', async () => {
  logger.info('SIGINT received, shutting down gracefully');
  await prisma.$disconnect();
  process.exit(0);
});

