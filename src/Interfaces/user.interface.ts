import { Document, ObjectId } from "mongoose";

export interface IUser extends Document {
  id: ObjectId;
  username: string;
  password: string;
  display_name: string;
  healthy_concern: Enumerator;
  food_allergen: string;
}
