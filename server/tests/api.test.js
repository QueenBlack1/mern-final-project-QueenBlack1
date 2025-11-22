const request = require('supertest');
const app = require('../app');
const User = require('../models/User');

describe('User API', () => {
  test('should create a new user', async () => {
    const res = await request(app)
      .post('/api/users')
      .send({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123'
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('_id');
  });

  test('should get all users', async () => {
    await User.create({ name: 'Test User', email: 'test@example.com' });
    
    const res = await request(app).get('/api/users');
    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toBeGreaterThan(0);
  });
});