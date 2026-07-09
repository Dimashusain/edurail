const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const verifyToken = require('./middleware/authMiddleware');

const semboyanRoutes = require('./routes/semboyanRoutes');
const keretaRoutes = require('./routes/keretaRoutes');
const artikelRoutes = require('./routes/artikelRoutes');

const app = express();
const cookieParser =
  require("cookie-parser");

app.use(cookieParser());

const ALLOWED_ORIGINS = [
  "http://localhost:3000",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. curl, Postman)
      if (!origin) return callback(null, true);
      if (ALLOWED_ORIGINS.includes(origin)) return callback(null, true);
      callback(new Error(`CORS: Origin ${origin} tidak diizinkan`));
    },
    credentials: true,
  })
);
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/semboyan', semboyanRoutes);
app.use('/api/kereta', keretaRoutes);
app.use('/api/artikel', artikelRoutes);
// Root Endpoint
app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'EduRail API Running'
    });
});

// Protected Route
app.get('/api/profile', verifyToken, (req, res) => {
    res.status(200).json({
        success: true,
        user: req.user
    });
});

// 404
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Endpoint tidak ditemukan'
    });
});

const PORT = process.env.PORT || 5000;

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`🚆 EduRail API running on port ${PORT}`);
    });
}

module.exports = app;