const { request, db, clearDatabase } = require('./testUtils');

describe('Auth Endpoints', () => {
  beforeAll(async () => {
    await db.sequelize.sync({ force: true });
  });
  afterEach(clearDatabase);
  afterAll(async () => {
    await db.sequelize.close();
  });

  it('should register a new user', async () => {
    const res = await request(db.app)
      .post('/auth/register')
      .send({ name: 'Test', email: 'test@example.com', password: 'password123' });
    expect(res.statusCode).toBe(201);
    expect(res.body.email).toBe('test@example.com');
  });

  it('should not register with duplicate email', async () => {
    await db.auth_user.create({ name: 'Test', email: 'test@example.com', password_hash: 'hash' });
    const res = await request(db.app)
      .post('/auth/register')
      .send({ name: 'Test', email: 'test@example.com', password: 'password123' });
    expect(res.statusCode).toBe(409);
  });

  it('should login and return a JWT', async () => {
    const bcrypt = require('bcrypt');
    const password_hash = await bcrypt.hash('password123', 10);
    await db.auth_user.create({ name: 'Test', email: 'test@example.com', password_hash });
    const res = await request(db.app)
      .post('/auth/login')
      .send({ email: 'test@example.com', password: 'password123' });
    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
  });
}); 