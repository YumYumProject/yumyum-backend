import { Schema } from "mongoose";
// import { IUser } from "../Interfaces/user.interface";

export const userSchema = new Schema({
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
});

// export const userModel = mongoose.model<IUser>("user", userSchema);

// console.log(userModel);
