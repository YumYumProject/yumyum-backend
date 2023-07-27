import { Request, Response } from "express";
import { JwtAuthRequest } from "../auth/jwt";

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

export interface WithUser {
  username: string;
  password: string;
  display_name: string;
  // healthy_concern?: Enumerator;
  // food_allergen?: string;
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

  //    getContent: HandlerFunc<JwtAuthRequest<WithId, any>>;
}

export interface IHandlerUser {
  register(req: AppRequest<Empty, WithUser>, res: Response): Promise<Response>;
  login(req: AppRequest<Empty, WithUser>, res: Response): Promise<Response>;
  getDataUserById(
    req: JwtAuthRequest<Empty, Empty>,
    res: Response
  ): Promise<Response>;
  logout(req: JwtAuthRequest<Empty, Empty>, res: Response): Promise<Response>;
}
