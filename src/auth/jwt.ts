import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { IRepositoryBlacklist } from "../repositories";
// import { ObjectId } from "mongodb";

export const secret = process.env.JWT_SECRET || "user-secrets";

export interface Payload {
  user_id: string;
  username: string;
  display_name: string;
}

export function newJwt(payload: Payload): string {
  return jwt.sign(payload, secret, {
    algorithm: "HS512",
    expiresIn: "12h",
    issuer: "Cooking",
    subject: "user-login",
    audience: "user",
  });
}

export interface JwtAuthRequest<Params, Body, Query>
  extends Request<Params, any, Body, Query> {
  token: string;
  payload: Payload;
}

export function newHandlerMiddleware(repoBlacklist: IRepositoryBlacklist) {
  return new HandlerMiddleware(repoBlacklist);
}

class HandlerMiddleware {
  private repoBlacklist: IRepositoryBlacklist;

  constructor(repo: IRepositoryBlacklist) {
    this.repoBlacklist = repo;
  }

  async jwtMiddleware(
    req: JwtAuthRequest<any, any, any>,
    res: Response,
    next: NextFunction
  ) {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    try {
      if (!token) {
        return res
          .status(401)
          .json({ error: "missing JWT token in header" })
          .end();
      }

      const isBlacklisted = await this.repoBlacklist.isBlacklisted(token);
      if (isBlacklisted) {
        return res.status(401).json({ status: `logged out` }).end();
      }

      const decoded = jwt.verify(token, secret);
      const user_id = decoded["id"];
      const username = decoded["username"];
      const display_name = decoded["display_name"];

      if (!user_id) {
        return res.status(401).json({ error: "missing payload `id`" }).end();
      }
      if (!username) {
        return res
          .status(401)
          .json({ error: "missing payload `username`" })
          .end();
      }

      req.token = token;
      req.payload = {
        user_id,
        username,
        display_name,
      };

      return next();
    } catch (err) {
      console.error(`Auth failed for token ${token}: ${err}`);
      return res.status(401).json({ error: "authentication failed" }).end();
    }
  }
}
