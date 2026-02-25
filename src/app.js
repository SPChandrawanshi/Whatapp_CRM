const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { errorMiddleware } = require('./middleware/error.middleware');

dotenv.config();

const app = express();

// Middlewares
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes (to be added)
app.get('/', (req, res) => {
    res.json({ success: true, message: 'CRM API is running' });
});

// Auth Routes
const authRoutes = require('./routes/auth.routes');
app.use('/api/auth', authRoutes);

// User Routes
const userRoutes = require('./routes/user.routes');
app.use('/api/users', userRoutes);

// Lead Routes
const leadRoutes = require('./routes/lead.routes');
app.use('/api/leads', leadRoutes);

// Dashboard Routes
const dashboardRoutes = require('./routes/dashboard.routes');
app.use('/api/dashboard', dashboardRoutes);

// Message Routes
const messageRoutes = require('./routes/message.routes');
app.use('/api/messages', messageRoutes);

// Billing Routes
const billingRoutes = require('./routes/billing.routes');
app.use('/api/billing', billingRoutes);

// Channel Routes
const channelRoutes = require('./routes/channel.routes');
app.use('/api/channels', channelRoutes);

// Counselor Routes
const counselorRoutes = require('./routes/counselor.routes');
app.use('/api/counselor', counselorRoutes);

// Audit Routes
const auditRoutes = require('./routes/audit.routes');
app.use('/api/audit', auditRoutes);

// Template Routes
const templateRoutes = require('./routes/template.routes');
app.use('/api/templates', templateRoutes);

// Routing Routes
const routingRoutes = require('./routes/routing.routes');
app.use('/api/routing', routingRoutes);

// Admin Routes
const adminRoutes = require('./routes/admin.routes');
app.use('/api/admin', adminRoutes);

// Super Admin Routes
const superAdminRoutes = require('./routes/superadmin.routes');
app.use('/api/super-admin', superAdminRoutes);

// Support Routes
const supportRoutes = require('./routes/support.routes');
app.use('/api/support', supportRoutes);

// Manager Routes
const managerRoutes = require('./routes/manager.routes');
app.use('/api/manager', managerRoutes);

// Team Leader Routes
const teamLeaderRoutes = require('./routes/teamleader.routes');
app.use('/api/team-leader', teamLeaderRoutes);

// Analytics Routes
const analyticsRoutes = require('./routes/analytics.routes');
app.use('/api/analytics', analyticsRoutes);

// Global Error Handler
app.use(errorMiddleware);

module.exports = app;
