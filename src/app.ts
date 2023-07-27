import mongoose from "mongoose";
import { newRepositoryContent } from "./repositories/content";
import { newHandlerContent } from "./handlers/content";
import express from "express";
import cors from "cors";
import "dotenv/config";
import { newRepositoryUser } from "./repositories/user.service";
import { newHandlerUser } from "./handlers/user";
import { createClient } from "redis";
import { expirer } from "./expirer";
import { newHandlerMiddleware } from "./auth/jwt";
import { newRepositoryBlacklist } from "./repositories/blacklist.service";

async function main() {
  const db = await mongoose.connect(`${process.env.MONGO_URI}`
  );
  const redis = createClient();

  try {
    redis.connect();
  } catch (err) {
    console.error(err);
    return;
  }

  expirer(redis);

  const repoContent = newRepositoryContent(db);
  const handlerContent = newHandlerContent(repoContent);
  const repositoryUser = newRepositoryUser(db);
  const repositoryoBlacklist = newRepositoryBlacklist(redis);
  const handlerUser = newHandlerUser(repositoryUser, repositoryoBlacklist);
  const handlerMiddleware = newHandlerMiddleware(repositoryoBlacklist);

  const port = process.env.PORT || 8000;
  const server = express();

  server.use(express.json());
  server.use(cors());

  const userRouter = express.Router();
  server.use("/user", userRouter);

  const authRouter = express.Router();
  server.use("/auth", authRouter);

  const menuRouter = express.Router();
  server.use("/menu", menuRouter);

  menuRouter.get("/", handlerContent.getRecipesByFilter.bind(handlerContent));
  server.get("/menus", handlerContent.getAllRecipes.bind(handlerContent));

  menuRouter.get("/:id", handlerContent.getRecipeById.bind(handlerContent));

  userRouter.post("/register", handlerUser.register.bind(handlerUser));
  authRouter.post("/login", handlerUser.login.bind(handlerUser));
  authRouter.get("/me",
  handlerMiddleware.jwtMiddleware.bind(handlerMiddleware),
  handlerUser.getDataUserById.bind(handlerUser));
  authRouter.get(
    "/logout",
    handlerMiddleware.jwtMiddleware.bind(handlerMiddleware),
    handlerUser.logout.bind(handlerUser)
  );

  authRouter.use(handlerMiddleware.jwtMiddleware.bind(handlerMiddleware));

  server.get("/", (req, res) => {
    res.send("Hello, world!");
  });

  server.listen(port, () => console.log(`server listening on ${port}`));
}

main();
