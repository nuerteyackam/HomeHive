const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const pool = require('./db');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const propertyRoutes = require('./routes/properties');
const enquiryRoutes = require('./routes/enquiries');
const investmentAnalysisRoutes = require('./routes/investmentAnalyses');

const app = express();

// Test database connection
pool.connect()
    .then(() => console.log('Connected to the database'))
    .catch((err) => {
        console.error('Error connecting to the database', err);
        process.exit(1); // Exit the process if the database connection fails
    });
    
// CORS configuration
const corsOptions = {
    origin: function(origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        const allowedOrigins = [
            'http://localhost:3000',
            'https://homehive-r13q6kgcj-joels-projects-13e73204.vercel.app'
        ];
        
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    credentials: false
};

app.use(cors(corsOptions));

// Handle OPTIONS preflight requests
app.options('*', cors(corsOptions));

app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/users', userRoutes);
app.use('/api/enquiries', enquiryRoutes);
app.use('/api/investment-analyses', investmentAnalysisRoutes);

// Remove static file serving and catch-all route since we're running API-only on Railway
// if (process.env.NODE_ENV === 'production'){
//     app.use(express.static(path.join(__dirname, '../client/build')));
//     app.get('*', (req, res) => {
//         res.sendFile(path.join(__dirname, '../client/build/index.html'));
//     });
// }

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
