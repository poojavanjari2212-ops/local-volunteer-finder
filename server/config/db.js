const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(
      process.env.MONGO_URI,
      {
        family: 4,
        serverSelectionTimeoutMS: 5000,
      }
    );

    console.log(
      "✅ MongoDB Connected:",
      connection.connection.host
    );

  } catch (error) {
    console.log(
      "❌ MongoDB Error:",
      error.message
    );

    process.exit(1);
  }
};

module.exports = connectDB;