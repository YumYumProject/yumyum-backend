import mongoose from "mongoose";
import express from "express";
import dotenv from "dotenv";

import { newRepositoryContent } from "./repositories/content";
import { newHandlerContent } from "./handlers/content";
import { newRepositoryUser } from "./repositories/user.service";
import { newHandlerUser } from "./handlers/user";
import { createClient } from "redis";
import { expirer } from "./expirer";
import { newHandlerMiddleware } from "./auth/jwt";
import { newRepositoryBlacklist } from "./repositories/blacklist.service";

dotenv.config()

async function main() {
  const useCors = process.env.CORS || "yes"
  const db = await mongoose.connect(`${process.env.MONGO_URI}`)
  const redis = createClient<any,any,any>({url: process.env.REDIS_URL});
  
  try {
    await redis.connect();
    await mongoose.set("strictQuery", true);
  } catch (err) {
    console.error(err);
    return;
  }

  expirer(redis);

  // const repoUser = newRepositoryUser(db);
  const repoBlacklist = newRepositoryBlacklist(redis);
  // const handlerUser = newHandlerUser(repoUser, repoBlacklist);

  const repoContent = newRepositoryContent(db);
  const handlerContent = newHandlerContent(repoContent);
  const repositoryUser = newRepositoryUser(db);
  const repositoryoBlacklist = newRepositoryBlacklist(redis);
  const handlerUser = newHandlerUser(repositoryUser, repositoryoBlacklist);
  const handlerMiddleware = newHandlerMiddleware(repoBlacklist);

  const port = process.env.PORT || 8000;
  const server = express();
  server.use(express.json());

  if (useCors.startsWith("y")) {
    console.log(`Using CORS middleware due to env CORS: ${useCors}`)
    const cors = require("cors");
    server.use(cors());
  }

  const userRouter = express.Router();
  server.use("/user", userRouter);

  const authRouter = express.Router();
  server.use("/auth", authRouter);

  const menuRouter = express.Router();
  const commentRouter = express.Router();

  server.use("/menu", menuRouter);
  server.use("/comment", commentRouter);

  menuRouter.get("/", handlerContent.getRecipesByFilter.bind(handlerContent));
  
  server.get("/menus", handlerContent.getAllRecipes.bind(handlerContent));

  menuRouter.get("/:id", handlerContent.getRecipeById.bind(handlerContent));

  menuRouter.post(
    "/:id",
    handlerMiddleware.jwtMiddleware.bind(handlerMiddleware),
    handlerContent.createCommentAndUpdateToContent.bind(handlerContent)
  );

  server.get("/", handlerContent.getThreeTopRecipes.bind(handlerContent))

  commentRouter.patch(
    "/:id/",
    handlerMiddleware.jwtMiddleware.bind(handlerMiddleware),
    handlerContent.editComment.bind(handlerContent)
  );

  commentRouter.get(
    "/:id",
    handlerMiddleware.jwtMiddleware.bind(handlerMiddleware),
    handlerContent.getCommentById.bind(handlerContent)
  );

  commentRouter.delete(
    "/:id",
    handlerMiddleware.jwtMiddleware.bind(handlerMiddleware),
    handlerContent.deleteCommentById.bind(handlerContent)
  );
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
