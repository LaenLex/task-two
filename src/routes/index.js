const express = require('express');
const router = express.Router();

// Example route
router.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

router.use('/users', require('./users'));

module.exports = router; 