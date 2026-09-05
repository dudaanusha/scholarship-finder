const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Load environment variables
dotenv.config();

const app = express();

// Body parser & CORS
app.use(express.json());
app.use(
  cors({
    origin: '*',
    credentials: true,
  })
);

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// 1. Health check endpoints (GET /api/health and GET /health)
app.get(['/api/health', '/health'], (req, res) => {
  const dbState = mongoose.connection.readyState;
  const states = {
    0: 'Disconnected',
    1: 'Connected',
    2: 'Connecting',
    3: 'Disconnecting',
  };

  res.status(200).json({
    success: true,
    status: 'online',
    message: 'Scholarship Finder Backend Server is healthy and running',
    system: 'AI-Powered Smart Scholarship Finder and Eligibility Recommendation System',
    database: {
      status: states[dbState] || 'Unknown',
      connected: dbState === 1,
      host: mongoose.connection.host || 'unknown',
      databaseName: mongoose.connection.name || (mongoose.connection.db ? mongoose.connection.db.databaseName : 'unknown'),
    },
    uptimeSeconds: Math.round(process.uptime()),
    timestamp: new Date().toISOString(),
  });
});

// 2. Base API welcome & route discovery endpoint (GET / and GET /api)
app.get(['/', '/api'], (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to the AI-Powered Smart Scholarship Finder & Eligibility Recommendation System API',
    status: 'online',
    version: '1.0.0',
    documentation: 'See docs/API_DOCUMENTATION.md for request and response specifications',
    healthCheck: '/api/health',
    endpoints: {
      health: 'GET /api/health',
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        me: 'GET /api/auth/me',
      },
      profile: {
        getProfile: 'GET /api/profile',
        updateProfile: 'PUT /api/profile',
      },
      scholarships: {
        getAll: 'GET /api/scholarships',
        getSingle: 'GET /api/scholarships/:id',
        filters: 'GET /api/scholarships/meta/filters',
        create: 'POST /api/scholarships (Admin)',
        update: 'PUT /api/scholarships/:id (Admin)',
        delete: 'DELETE /api/scholarships/:id (Admin)',
      },
      recommendations: {
        getPersonalized: 'GET /api/recommendations',
        simulate: 'POST /api/recommendations/simulate',
      },
      applications: {
        getUserApplications: 'GET /api/applications',
        toggleSave: 'POST /api/applications/save/:scholarshipId',
        apply: 'POST /api/applications/apply/:scholarshipId',
        updateStatus: 'PUT /api/applications/:id/status',
        adminGetAll: 'GET /api/applications/admin/all (Admin)',
      },
      notifications: {
        getAll: 'GET /api/notifications',
        markRead: 'PUT /api/notifications/:id/read',
        markAllRead: 'PUT /api/notifications/read-all',
      },
      analytics: {
        admin: 'GET /api/analytics/admin (Admin)',
        student: 'GET /api/analytics/student',
      },
    },
    timestamp: new Date().toISOString(),
  });
});

// 3. Mount core API routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/profile', require('./routes/profileRoutes'));
app.use('/api/scholarships', require('./routes/scholarshipRoutes'));
app.use('/api/recommendations', require('./routes/recommendationRoutes'));
app.use('/api/applications', require('./routes/applicationRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/analytics', require('./routes/analyticsRoutes'));

// 4. Catch-all JSON 404 handler for undefined routes
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Cannot ${req.method} ${req.originalUrl} - Endpoint not found`,
    healthEndpoint: '/api/health',
    apiRoot: '/api',
  });
});

// 5. Global error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Initialize Database and Start Server
async function startServer() {
  try {
    await connectDB();

    // Check if database needs seeding
    const Scholarship = require('./models/Scholarship');
    const scholarshipCount = await Scholarship.countDocuments();

    if (scholarshipCount === 0) {
      console.log('🔄 Seeding initial dataset...');
      const seedDatabase = require('./seed/seedData');
      await seedDatabase();
    }

    const server = app.listen(PORT, () => {
      console.log(`🚀 Scholarship Finder Backend Server running on port ${PORT}`);
      console.log(`👉 API Base: http://localhost:${PORT}/api`);
      console.log(`👉 Health check: http://localhost:${PORT}/api/health`);
    });

    return server;
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  startServer();
}

module.exports = { app, startServer };
