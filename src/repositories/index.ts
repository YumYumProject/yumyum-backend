// import { ObjectId } from "mongodb";
import { IContent } from "../Interfaces/content.interface";
// import { IUser } from "../Interfaces/user.interface";
import { ICreateUser, IUser } from "../Interfaces/user.interface";

export interface IRepositoryContent {
  createContent();
  getAllRecipes(): Promise<IContent[]>;
  getRecipesByFilter(
    material: string,
    process: string,
    nationality: string
  ): Promise<IContent[]>;
  getRecipeById(id: string): Promise<IContent | null>;
}

export interface IRepositoryUser {
  createUser(user: ICreateUser): Promise<IUser>;
  getUser(username: string): Promise<IUser>;
  getDataUserById(id: string): Promise<IUser | null>;
}
export interface IRepositoryBlacklist {
  addToBlacklist(token: string): Promise<void>;
  isBlacklisted(token: string): Promise<boolean>;
}
