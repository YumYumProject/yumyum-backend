import { Document, ObjectId } from "mongoose";

export interface ICreateUser {
  username: string;
  password: string;
  display_name: string;
  healthy_concern?: Enumerator;
  food_allergen?: string;
}

export interface IUser extends Document, ICreateUser {
  id: ObjectId;
}
