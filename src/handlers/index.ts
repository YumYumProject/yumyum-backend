import { Request, Response } from "express";
import { JwtAuthRequest } from "../auth/jwt";
import { ICommentBy } from "../Interfaces/content.interface";

export interface AppRequest<Params, Body> extends Request<Params, any, Body> {}

export type HandlerFunc<Req> = (req: Req, res: Response) => Promise<Response>;

export interface Empty {}

export interface WithId {
  id: string;
}

export interface WithContent {
  material: string;
  process: string;
  nationality: string;
}

export interface WithComment {
  description: string;
  rating: number;
  display_name: string;
  user_id: string;
}

// export interface WithCommentBy {
//   display_name: string;
//   user_id: string;
// }
export interface WithUser {
  username: string;
  name: string;
  password: string;
}

export interface IHandlerContent {
  //    createContent: HandlerFunc<JwtAuthRequest<Empty, WithContent>>;
  //   getRecipesByFilter: HandlerFunc<JwtAuthRequest<Empty, WithContent>>;
  getAllRecipes(req: Request, res: Response): Promise<Response>;
  getRecipesByFilter(
    req: Request<Empty, Empty, Empty, WithContent>,
    res: Response
  ): Promise<Response>;
  getRecipeById(req: Request, res: Response): Promise<Response>;
  createCommentAndUpdateToContent(
    req: Request<WithId, Empty, WithComment>,
    res: Response
  ): Promise<Response>;

  //    getContent: HandlerFunc<JwtAuthRequest<WithId, any>>;
}

export interface IHandlerUser {
  register: HandlerFunc<AppRequest<Empty, WithUser>>;
  login: HandlerFunc<AppRequest<Empty, WithUser>>;
  logout: HandlerFunc<JwtAuthRequest<Empty, Empty>>;
  getDataUser(
    req: JwtAuthRequest<Empty, Empty>,
    res: Response
  ): Promise<Response>;
}
