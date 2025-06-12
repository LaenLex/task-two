const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
dotenv.config();

const routes = require('./routes');
const authRoutes = require('./routes/auth');
const jwtAuth = require('./middlewares/auth');

const app = express();
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3001',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use('/api', routes);
app.use('/auth', authRoutes);

app.get('/', (req, res) => {
  res.send('API is running');
});

// Example protected route
app.get('/protected', jwtAuth, (req, res) => {
  res.json({ message: 'Protected content', user: req.user });
});

if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app; 