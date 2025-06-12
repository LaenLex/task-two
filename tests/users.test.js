const { request, db, clearDatabase } = require('./testUtils');
let token;

beforeAll(async () => {
  await db.sequelize.sync({ force: true });
  // Register and login to get JWT
  await request(db.app)
    .post('/auth/register')
    .send({ name: 'Admin', email: 'admin@example.com', password: 'adminpass' });
  const res = await request(db.app)
    .post('/auth/login')
    .send({ email: 'admin@example.com', password: 'adminpass' });
  token = res.body.token;
});
afterEach(clearDatabase);
afterAll(async () => {
  await db.sequelize.close();
});

describe('Users CRUD', () => {
  it('should create a user (POST /users)', async () => {
    const userData = {
      name: 'John Doe',
      username: 'johndoe',
      email: 'john@example.com',
      phone: '123-456-7890',
      website: 'johndoe.com',
      address: {
        street: 'Main St',
        suite: 'Apt 1',
        city: 'Metropolis',
        zipcode: '12345',
        geo: { lat: '10.0', lng: '20.0' }
      },
      company: {
        name: 'Acme Corp',
        catchPhrase: 'We build stuff',
        bs: 'business'
      }
    };
    const res = await request(db.app)
      .post('/api/users')
      .set('Authorization', `Bearer ${token}`)
      .send(userData);
    expect(res.statusCode).toBe(201);
    expect(res.body.name).toBe('John Doe');
    expect(res.body.address).toBeDefined();
    expect(res.body.company).toBeDefined();
  });

  it('should get all users (GET /users)', async () => {
    const res = await request(db.app).get('/api/users');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should get user by ID (GET /users/:id)', async () => {
    // Create a user first
    const user = await db.User.create({
      name: 'Jane Doe',
      username: 'janedoe',
      email: 'jane@example.com',
      phone: '987-654-3210',
      website: 'janedoe.com',
      addressId: null,
      companyId: null
    });
    const res = await request(db.app).get(`/api/users/${user.id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe('Jane Doe');
  });

  it('should update a user (PUT /users/:id)', async () => {
    // Create a user first
    const user = await db.User.create({
      name: 'Jane Doe',
      username: 'janedoe',
      email: 'jane@example.com',
      phone: '987-654-3210',
      website: 'janedoe.com',
      addressId: null,
      companyId: null
    });
    const res = await request(db.app)
      .put(`/api/users/${user.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Jane Updated',
        username: 'janedoe',
        email: 'jane@example.com',
        phone: '987-654-3210',
        website: 'janedoe.com',
        address: {
          street: 'Main St',
          suite: 'Apt 1',
          city: 'Metropolis',
          zipcode: '12345',
          geo: { lat: '10.0', lng: '20.0' }
        },
        company: {
          name: 'Acme Corp',
          catchPhrase: 'We build stuff',
          bs: 'business'
        }
      });
    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe('Jane Updated');
  });

  it('should delete a user (DELETE /users/:id)', async () => {
    // Create a user first
    const user = await db.User.create({
      name: 'Jane Doe',
      username: 'janedoe',
      email: 'jane@example.com',
      phone: '987-654-3210',
      website: 'janedoe.com',
      addressId: null,
      companyId: null
    });
    const res = await request(db.app)
      .delete(`/api/users/${user.id}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('User deleted');
  });
}); 