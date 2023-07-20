import { Request, Response } from "express";
import { JwtAuthRequest } from "../auth/jwt";

export interface AppRequest<Params, Body> extends Request<Params, any, Body> {}

export type HandlerFunc<Req> = (req: Req, res: Response) => Promise<Response>;

export interface Empty {}

export interface WithId {
  id: string;
}

export interface WithContent {
  material: string[];
  process: string;
  nationality: string;
}

export interface WithUser {
  username: string;
  name: string;
  password: string;
}

export interface IHandlerContent {
  //    createContent: HandlerFunc<JwtAuthRequest<Empty, WithContent>>;
  //   getRecipesByFilter: HandlerFunc<JwtAuthRequest<Empty, WithContent>>;
  getRecipesByFilter(req: Request, res: Response): Promise<Response>;
  getRecipeById(req: Request, res: Response): Promise<Response>;

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
