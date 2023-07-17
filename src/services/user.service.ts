import mongoose from "mongoose";
import { IUser } from "../Interfaces/user.interface";
import { userModel } from "../models/user.model";
import "dotenv/config";

mongoose.set("strictQuery", true);

mongoose.connect(
  `mongodb+srv://${process.env.USERNAME}:${process.env.PASSWORD}@cluster0.pqbm4xu.mongodb.net/?retryWrites=true&w=majority`
);

async function createUser() {
  const newUser: IUser = new userModel({
    username: "Mai",
    password: "12345678",
    display_name: "M",
  });
  newUser
    .save()
    .then(() => console.log("User created successfully"))
    .catch((err) => console.error(err));
}

createUser();
