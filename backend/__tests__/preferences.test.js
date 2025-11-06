const request = require('supertest');
const express = require('express');
const preferencesRoutes = require('../routes/preferences');
const prisma = require('../config/database');
const authMiddleware = require('../middleware/auth');

// Mock auth middleware
jest.mock('../middleware/auth', () => {
  return jest.fn((req, res, next) => {
    req.user = { id: 'test-user-id' };
    next();
  });
});

const app = express();
app.use(express.json());
app.use('/api/preferences', preferencesRoutes);

describe('Preferences Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/preferences', () => {
    it('should return user preferences', async () => {
      const response = await request(app)
        .get('/api/preferences');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('preferences');
    });
  });

  describe('PUT /api/preferences', () => {
    it('should update user preferences', async () => {
      const response = await request(app)
        .put('/api/preferences')
        .send({
          workDuration: 30,
          shortBreak: 10,
          longBreak: 20,
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('preferences');
      expect(response.body.message).toBe('Preferences updated successfully');
    });

    it('should return 400 for invalid work duration', async () => {
      const response = await request(app)
        .put('/api/preferences')
        .send({
          workDuration: 200, // Invalid: max is 60
        });

      expect(response.status).toBe(400);
    });
  });
});

