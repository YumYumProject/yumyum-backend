import { Request, Response } from "express";
import { JwtAuthRequest } from "../auth/jwt";

export interface AppRequest<Params, Body, Query>
  extends Request<Params, any, Body, Query> {}

export type HandlerFunc<Req> = (req: Req, res: Response) => Promise<Response>;

export interface Empty {}

export interface WithId {
  id: string;
}

export interface WithUserId {
  user_id: string;
}
export interface WithContent {
  material: string;
  process: string;
  nationality: string;
  healthy_concern: string;
  food_allergen: string;
}

export interface WithComment {
  user_id: string;
  description: string;
  rating: number;
}

export interface WithDelete {
  comment_id: string;
}

export interface WithGetComment {
  comment_id: string;
}
export interface WithEditComment {
  comment_id: string;
}

export interface WithNewComment extends WithComment {
  display_name: string;
  user_id: string;
}

export interface WithDeleteComment {
  comment_id: string;
}

export interface WithCommentBy {
  display_name: string;
  user_id: string;
}
export interface WithUser {
  username: string;
  name: string;
  password: string;
}

export interface IHandlerContent {
  //    createContent: HandlerFunc<JwtAuthRequest<Empty, WithContent>>;
  //   getRecipesByFilter: HandlerFunc<JwtAuthRequest<Empty, WithContent>>;
  getAllRecipes(
    req: AppRequest<Empty, Empty, Empty>,
    // req: Request,
    res: Response
  ): Promise<Response>;
  getRecipesByFilter(
    req: AppRequest<Empty, Empty, WithContent>,
    // req: Request<Empty, Empty, Empty, WithContent>,
    res: Response
  ): Promise<Response>;
  getRecipeById(
    req: AppRequest<WithId, Empty, Empty>,
    res: Response
  ): Promise<Response>;
  createCommentAndUpdateToContent(
    req: JwtAuthRequest<WithId, WithNewComment, Empty>,
    // req: Request<WithId, Empty, WithNewComment>,
    res: Response
  ): Promise<Response>;

  editComment(
    req: JwtAuthRequest<WithId, WithComment, WithEditComment>,
    // req: Request<WithId, Empty, WithComment, WithEditComment>,
    res: Response
  ): Promise<Response>;

  deleteCommentById(
    req: JwtAuthRequest<WithId, WithUserId, WithDelete>,
    // req: Request<WithId, Empty,Empty, WithDelete>,
    res: Response
  ): Promise<Response>;

  getCommentById(
    req: JwtAuthRequest<WithId, Empty, WithGetComment>,
    // req: Request<WithId, Empty, Empty, WithGetComment>,
    res: Response
  ): Promise<Response>;

  //    getContent: HandlerFunc<JwtAuthRequest<WithId, any>>;
}

export interface IHandlerUser {
  register: HandlerFunc<AppRequest<Empty, WithUser, Empty>>;
  login: HandlerFunc<AppRequest<Empty, WithUser, Empty>>;
  logout: HandlerFunc<JwtAuthRequest<Empty, Empty, Empty>>;
  getDataUser(
    req: JwtAuthRequest<Empty, Empty, Empty>,
    res: Response
  ): Promise<Response>;
}
