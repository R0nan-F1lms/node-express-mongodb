module.exports = {
  // Use MONGO_URL if set (e.g., in Docker or CI)
  // Otherwise, default to localhost for local development
  url: process.env.MONGO_URL || "mongodb://localhost:27017/bezkoder_db",
};
