import { IContent } from "../Interfaces/content.interface";

export interface IRepositoryContent {
  createContent();
  getAllRecipes(): Promise<IContent[]>;
  getRecipesByFilter(
    material: string,
    process: string,
    nationality: string
  ): Promise<IContent[]>;
  getRecipeById(id: string): Promise<IContent | null>;
  createCommentAndUpdateToContent(
    contentId: string,
    description: string,
    rating: number,
    display_name: string,
    userId: string
  ): Promise<IContent>;
}

export interface IRepositoryUser {
  createUser();
}
