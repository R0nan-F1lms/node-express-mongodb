const request = require('supertest');
const db = require("../app/models"); // db.mongoose is here
const app = require('../server');

describe('API Health Check', () => {
  it('should return 200 on root endpoint', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ message: 'Welcome to bezkoder application.' });
  });
});
afterAll(async () => {
  // Close the Mongoose connection to let Jest exit
  await db.mongoose.connection.close();
  // Small delay ensures all async tasks finish
  await new Promise(resolve => setTimeout(resolve, 500));
});