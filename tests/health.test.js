const request = require('supertest');
const app = require('../server'); // server.js must export app

describe('API Health Check', () => {
  it('should return 404 on root endpoint', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(404);
  });
});
