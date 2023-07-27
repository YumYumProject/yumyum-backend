import { IContent } from "../Interfaces/content.interface";
import { ICreateUser, IUser } from "../Interfaces/user.interface";

export interface IRepositoryContent {
  createContent();
  getAllRecipes(): Promise<IContent[]>;
  getRecipesByFilter(
    material: string,
    process: string,
    nationality: string,
    healthy_concern: string,
    food_allergen: string
  ): Promise<IContent[]>;

  getRecipeById(id: string): Promise<IContent | null>;
  createCommentAndUpdateToContent(
    contentId: string,
    description: string,
    rating: number,
    display_name: string,
    userId: string
  ): Promise<IContent>;

  updateAverageRatingForContent(contentId: string): Promise<IContent>;
  editComment(
    user_id: string,
    content_id: string,
    comment_id: string,
    newDescription: string,
    newRating: number
  ): Promise<IContent>;
  deleteCommentById(
    user_id: string,
    content_id: string,
    comment_id: string
  ): Promise<void>;
  getCommentById(
    user_id: string,
    content_id: string,
    comment_id: string
  ): Promise<IContent>;
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
