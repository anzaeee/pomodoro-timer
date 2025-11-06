const request = require('supertest');
const express = require('express');

const app = express();
app.use(express.json());

// Mock health endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Pomodoro Timer API is running', 
    timestamp: new Date().toISOString(),
  });
});

describe('Health Check', () => {
  it('should return 200 and health status', async () => {
    const response = await request(app)
      .get('/api/health');

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('ok');
    expect(response.body).toHaveProperty('timestamp');
  });
});

