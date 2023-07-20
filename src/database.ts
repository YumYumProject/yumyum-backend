// database.ts
import mongoose from "mongoose";
import "dotenv/config";

const connectToDatabase = async () => {
  try {
    mongoose.set("strictQuery", true);
    await mongoose.connect(
      `mongodb+srv://${process.env.USERNAME}:${process.env.PASSWORD}@cluster0.pqbm4xu.mongodb.net/EazyEat?retryWrites=true&w=majority`
    );
    console.log("Connected to MongoDB.");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
  }
};

export default connectToDatabase;
