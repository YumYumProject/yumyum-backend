import { Response } from "express";
import { IRepositoryUser } from "../repositories";
import { AppRequest, Empty, WithUser } from ".";
import { compareHash, hashPassword } from "../auth/bcrypt";
import { IHandlerUser } from ".";
import { JwtAuthRequest, Payload, newJwt } from "../auth/jwt";
import { IRepositoryBlacklist } from "../repositories";

// import { ObjectId } from "mongodb";

export function newHandlerUser(
  repo: IRepositoryUser,
  repoBlacklist: IRepositoryBlacklist
): IHandlerUser {
  return new HandlerUser(repo, repoBlacklist);
}
class HandlerUser implements IHandlerUser {
  private repo: IRepositoryUser;
  private RepositoryBlacklist: IRepositoryBlacklist;

  constructor(repo: IRepositoryUser, repoBlacklist: IRepositoryBlacklist) {
    this.repo = repo;
    this.RepositoryBlacklist = repoBlacklist;
  }

  async register(
    req: AppRequest<Empty, WithUser, Empty>,
    res: Response
  ): Promise<Response> {
    const { username, password, display_name } = req.body;

    if (!username || !password || !display_name) {
      return res
        .status(400)
        .json({ error: "missing username password and name" })
        .end();
    }
    return this.repo
      .createUser({
        username,
        password: hashPassword(password),
        display_name,
      })

      .then((user) => {
        console.log(user);
        return res
          .status(201)
          .json({
            ...user._doc,
            password: undefined,
          })
          .end();
      })
      .catch((err) => {
        const errMsg = `failed`;
        console.error(errMsg);
        return res.status(500).json({ error: `${errMsg} to register` });
      });
  }
  async login(
    req: AppRequest<Empty, WithUser, Empty>,
    res: Response
  ): Promise<Response> {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ error: "missing username or password" })
        .end();
    }

    return this.repo
      .getUser(username)
      .then((user) => {
        if (!compareHash(password, user.password)) {
          return res
            .status(401)
            .json({ error: "invalid username or password",statusCode: 401 })
            .end();
        }
        const payload: Payload = { user_id: user.id, username: user.username, display_name: user.display_name };
        const token = newJwt(payload);

        return res
          .status(200)
          .json({
            status: "logged in",
            _id: user.id,
            username,
            token,
          })
          .end();
      })
      .catch((err) => {
        console.error(`failed to get user: ${err}`);
        return res.status(500).end();
      });
  }

  async getDataUserById(
    req: JwtAuthRequest<Empty, Empty, Empty>,
    res: Response
  ): Promise<Response> {
    if (!req.payload.user_id) {
      return res.status(400).json({ error: "wrong username or password" });
    }

    console.log(req.payload.user_id);

    return this.repo
      .getDataUserById(req.payload.user_id)
      .then((user) => res.status(200).json(user))
      .catch((err) => {
        const errMsg = `failed to get id`;
        console.error(`${errMsg}: ${err}`);

        return res.status(500).json({ error: `failed to get id` });
      });
  }
  async logout(
    req: JwtAuthRequest<Empty, Empty, Empty>,
    res: Response
  ): Promise<Response> {
    return await this.RepositoryBlacklist.addToBlacklist(req.token)
      .then(() =>
        res.status(200).json({ status: `logged out`, token: req.token }).end()
      )
      .catch((err) => {
        console.error(err);
        return res
          .status(500)
          .json({ error: `could not log out with token ${req.token}` })
          .end();
      });
  }
}
