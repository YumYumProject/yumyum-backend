// import { ObjectId } from "mongoose";

export interface ICreateUser {
  username: string;
  password: string;
  display_name: string;
  healthy_concern?: Enumerator;
  food_allergen?: string;
}

export interface IUser {
  id: string;
  username: string;
  password: string;
  display_name: string
  _doc: ICreateUser;
}
