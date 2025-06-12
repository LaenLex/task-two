const axios = require('axios');
const db = require('../models');

async function seedUsers() {
  try {
    await db.sequelize.sync({ force: true });
    const { data: users } = await axios.get('https://jsonplaceholder.typicode.com/users');
    for (const user of users) {
      // Create Geo
      const geo = await db.Geo.create(user.address.geo);
      // Create Address
      const address = await db.Address.create({
        street: user.address.street,
        suite: user.address.suite,
        city: user.address.city,
        zipcode: user.address.zipcode,
        geoId: geo.id
      });
      // Create Company
      const company = await db.Company.create(user.company);
      // Create User
      await db.User.create({
        name: user.name,
        username: user.username,
        email: user.email,
        phone: user.phone,
        website: user.website,
        addressId: address.id,
        companyId: company.id
      });
    }
    console.log('Database seeded successfully.');
    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
}

seedUsers(); 