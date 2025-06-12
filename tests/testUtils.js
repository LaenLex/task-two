const db = require('../models');
const request = require('supertest');
const app = require('../src/index');

async function clearDatabase() {
  await db.User?.destroy({ where: {}, truncate: { cascade: true } });
  await db.Address?.destroy({ where: {}, truncate: { cascade: true } });
  await db.Geo?.destroy({ where: {}, truncate: { cascade: true } });
  await db.Company?.destroy({ where: {}, truncate: { cascade: true } });
  await db.auth_user?.destroy({ where: {}, truncate: { cascade: true } });
}

module.exports = { db, request, app, clearDatabase }; 