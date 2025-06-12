const { db } = require('./testUtils');

describe('Sequelize Model Validation', () => {
  beforeAll(async () => {
    await db.sequelize.sync({ force: true });
  });
  afterAll(async () => {
    await db.sequelize.close();
  });

  it('should not create a user with invalid email', async () => {
    let error;
    try {
      await db.User.create({ name: 'Bad', username: 'bad', email: 'not-an-email', phone: '123', website: 'bad.com' });
    } catch (err) {
      error = err;
    }
    expect(error).toBeDefined();
  });

  it('should require all fields for User', async () => {
    let error;
    try {
      await db.User.create({});
    } catch (err) {
      error = err;
    }
    expect(error).toBeDefined();
  });
}); 