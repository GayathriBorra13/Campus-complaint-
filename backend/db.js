
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;

    if (!mongoUri) {
      throw new Error("MONGO_URI is missing in .env");
    }

    await mongoose.connect(mongoUri, {
      dbName: process.env.MONGO_DB_NAME || "campus_complaints",
      serverSelectionTimeoutMS: 10000,
    });

    console.log("");
    console.log("========================================");
    console.log("       MONGODB CONNECTION DETAILS");
    console.log("========================================");

    console.log(
      "Configured database:",
      process.env.MONGO_DB_NAME || "campus_complaints"
    );

    console.log(
      "Actual database:",
      mongoose.connection.db.databaseName
    );

    console.log(
      "MongoDB host:",
      mongoose.connection.host
    );

    console.log(
      "MongoDB port:",
      mongoose.connection.port
    );

    console.log("========================================");

    // Check collections
    const collections = await mongoose.connection.db
      .listCollections()
      .toArray();

    console.log("Collections in this database:");

    if (collections.length === 0) {
      console.log("No collections found.");
    } else {
      collections.forEach((collection) => {
        console.log("-", collection.name);
      });
    }

    console.log("========================================");

    // Check complaints collection directly
    const complaintsCollection =
      mongoose.connection.db.collection("complaints");

    const complaintCount =
      await complaintsCollection.countDocuments();

    console.log(
      "Direct complaints collection count:",
      complaintCount
    );

    console.log("========================================");
    console.log("");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    throw error;
  }
};

module.exports = connectDB;
