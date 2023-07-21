import { IContent } from "../Interfaces/content.interface";
import { IUser } from "../Interfaces/user.interface";

export interface IUserRepository {
  findByUsername(username: string): Promise<IUser | null>;
  createUser(userData: IUser): Promise<IUser>;
}

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
  createUser();
}
