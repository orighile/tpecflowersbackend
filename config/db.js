import mongoose from "mongoose";

const connectDB = async () => {
  mongoose.connection.on("connected", () => {
    console.log("DB connected");
  });

  const mongoURL = process.env.MONGODB_URL;

  if (!mongoURL) {
    throw new Error("MONGODB_URL is not defined in .env file");
  }

  try {
    await mongoose.connect(mongoURL);
    console.log("MongoDB connection successful");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

export default connectDB;
