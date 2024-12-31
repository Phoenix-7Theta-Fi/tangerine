const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();

// Singleton pattern for MongoDB connection
class MongoDBConnection {
  constructor() {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI must be defined');
    }

    this.uri = process.env.MONGODB_URI;
    this.client = null;
    this.connectionOptions = {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: false,
        deprecationErrors: true,
      },
      // Connection pool settings
      maxPoolSize: 10,
      minPoolSize: 5,
      socketTimeoutMS: 45000,
      family: 4 // Use IPv4, helps with connection issues
    };
  }

  async connect() {
    if (this.client) return this.client;

    try {
      this.client = new MongoClient(this.uri, this.connectionOptions);
      await this.client.connect();
      
      // Verify connection
      await this.client.db('admin').command({ ping: 1 });
      console.log('✅ Successfully connected to MongoDB');
      
      return this.client;
    } catch (error) {
      console.error('❌ MongoDB Connection Error:', error);
      throw error;
    }
  }

  async getDatabase(dbName = 'tangerine') {
    if (!this.client) await this.connect();
    return this.client.db(dbName);
  }

  async close() {
    if (this.client) {
      await this.client.close();
      this.client = null;
      console.log('🔌 MongoDB connection closed');
    }
  }

  // Utility method for error handling
  static handleConnectionError(error) {
    console.error('MongoDB Error:', error);
    // Implement retry logic or notification mechanism
    return null;
  }
}

// Export a function to get connection instance
module.exports = {
  connectDB: async () => {
    const connection = new MongoDBConnection();
    return connection;
  },
  MongoDBConnection
};