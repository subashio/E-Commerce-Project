import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

if (!process.env.DATABASE_URI) {
  throw new Error("Please provide DATABASE_URI in the .env file");
}

async function connectDB() {
  try {
    await mongoose.connect(process.env.DATABASE_URI, {
      tls: true,
    });
    console.log("connect DB");
  } catch (error) {
    console.log("Mongodb connect error", error);
    process.exit(1);
  }
}

export default connectDB;
