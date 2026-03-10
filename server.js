const express = require('express');
const dotenv = require('dotenv');
const { connectDB } = require('./config/db');
const authRoutes = require('./routes/auth');

dotenv.config();

const app = express();
app.use(express.json());

// маршрути
app.use('/api/auth', authRoutes);

// підключення до БД
connectDB();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});

