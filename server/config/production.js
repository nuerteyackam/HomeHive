module.exports = {
  // Database configuration
  db: {
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  },
  
  // JWT configuration
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: '24h'
  },

  // Server configuration
  server: {
    port: process.env.PORT || 5000
  },

  // CORS configuration
  cors: {
    origin: process.env.CLIENT_URL || 'https://your-domain.com',
    credentials: true
  }
}; 