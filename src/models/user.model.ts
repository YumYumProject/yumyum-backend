import mongoose, { Schema } from "mongoose";
import { IUser } from "../Interfaces/user.interface";

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minlength: 8,
  },
  display_name: {
    type: String,
    required: true,
    unique: true,
  },
  healthy_concern: {
    type: String,
    enum: ["เบาหวาน", "ความดัน", "หัวใจ", "ไต", "ลดน้ำหนัก", "อ้วน"],
  },
  food_allergen: {
    type: String,
  },
});

export const userModel = mongoose.model<IUser>("user", userSchema);

// console.log(userModel);
