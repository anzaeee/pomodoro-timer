const request = require('supertest');
const express = require('express');
const presetsRoutes = require('../routes/presets');
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
app.use('/api/presets', presetsRoutes);

describe('Presets Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/presets', () => {
    it('should return user presets', async () => {
      const response = await request(app)
        .get('/api/presets');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('presets');
      expect(Array.isArray(response.body.presets)).toBe(true);
    });
  });

  describe('POST /api/presets', () => {
    it('should create a new preset', async () => {
      const response = await request(app)
        .post('/api/presets')
        .send({
          name: 'Test Preset',
          workDuration: 45,
          shortBreak: 10,
          longBreak: 20,
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('preset');
      expect(response.body.preset.name).toBe('Test Preset');
    });

    it('should return 400 for invalid preset data', async () => {
      const response = await request(app)
        .post('/api/presets')
        .send({
          name: '',
          workDuration: 45,
        });

      expect(response.status).toBe(400);
    });
  });
});

