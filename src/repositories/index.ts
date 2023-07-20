import { IContent } from "../Interfaces/content.interface";

export interface IRepositoryContent {
  createContent();
  getRecipesByFilter(
    material: string[],
    process: string,
    nationality: string
  ): Promise<IContent[]>;
  getRecipeById(id: string): Promise<IContent | null>;
}

export interface IRepositoryUser {
  createUser();
}
