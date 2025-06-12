const express = require('express');
const router = express.Router();
const Joi = require('joi');
const jwtAuth = require('../middlewares/auth');
const { User, Address, Geo, Company } = require('../../models');

// Validation schemas
const userSchema = Joi.object({
  name: Joi.string().required(),
  username: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
  website: Joi.string().required(),
  address: Joi.object({
    street: Joi.string().required(),
    suite: Joi.string().required(),
    city: Joi.string().required(),
    zipcode: Joi.string().required(),
    geo: Joi.object({
      lat: Joi.string().required(),
      lng: Joi.string().required()
    }).required()
  }).required(),
  company: Joi.object({
    name: Joi.string().required(),
    catchPhrase: Joi.string().required(),
    bs: Joi.string().required()
  }).required()
});

// GET all users
router.get('/', async (req, res) => {
  try {
    const users = await User.findAll({
      include: [
        { model: Address, include: [Geo] },
        { model: Company }
      ]
    });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET user by ID
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      include: [
        { model: Address, include: [Geo] },
        { model: Company }
      ]
    });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// POST create user (protected)
router.post('/', jwtAuth, async (req, res) => {
  const { error } = userSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });
  try {
    // Create nested Geo, Address, Company, then User
    const geo = await Geo.create(req.body.address.geo);
    const address = await Address.create({ ...req.body.address, geoId: geo.id });
    const company = await Company.create(req.body.company);
    const user = await User.create({
      name: req.body.name,
      username: req.body.username,
      email: req.body.email,
      phone: req.body.phone,
      website: req.body.website,
      addressId: address.id,
      companyId: company.id
    });
    const result = await User.findByPk(user.id, {
      include: [
        { model: Address, include: [Geo] },
        { model: Company }
      ]
    });
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// PUT update user (protected)
router.put('/:id', jwtAuth, async (req, res) => {
  const { error } = userSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });
  try {
    const user = await User.findByPk(req.params.id, {
      include: [Address, Company]
    });
    if (!user) return res.status(404).json({ message: 'User not found' });
    // Update nested models
    await user.update({
      name: req.body.name,
      username: req.body.username,
      email: req.body.email,
      phone: req.body.phone,
      website: req.body.website
    });
    await user.Address.update({
      street: req.body.address.street,
      suite: req.body.address.suite,
      city: req.body.address.city,
      zipcode: req.body.address.zipcode
    });
    await user.Address.Geo.update({
      lat: req.body.address.geo.lat,
      lng: req.body.address.geo.lng
    });
    await user.Company.update({
      name: req.body.company.name,
      catchPhrase: req.body.company.catchPhrase,
      bs: req.body.company.bs
    });
    const result = await User.findByPk(user.id, {
      include: [
        { model: Address, include: [Geo] },
        { model: Company }
      ]
    });
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// DELETE user (protected)
router.delete('/:id', jwtAuth, async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      include: [Address, Company]
    });
    if (!user) return res.status(404).json({ message: 'User not found' });
    await user.destroy();
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router; 