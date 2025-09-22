const request = require('supertest');
const app = require('../server');

describe('API Health Check', () => {
  it('should return 200 on root endpoint', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
    expect(res.text).toBe('{\"message\":\"Welcome to bezkoder application.\"}');
  });
});
afterAll(async () => {
  const mongoose = require('mongoose');
  await mongoose.connection.close();
});
