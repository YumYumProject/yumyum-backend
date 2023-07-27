import mongoose from "mongoose";
import { newRepositoryContent } from "./repositories/content";
import { newHandlerContent } from "./handlers/content";
import express from "express";
import cors from "cors";
import { HandlerMiddleware } from "./auth/jwt";
import { newRepositoryBlacklist } from "./repositories/blacklist.service";
import { createClient } from "redis";

// async function main() {

//   const redis = createClient();

//   try {
//     redis.connect();
//     db.$connect();
//   } catch (err) {
//     console.error(err);
//     return;
//   }

async function main() {
  const db = await mongoose.connect(
    `mongodb+srv://${process.env.USERNAME}:${process.env.PASSWORD}@cluster0.pqbm4xu.mongodb.net/EazyEat?retryWrites=true&w=majority`
  );

  const redis = createClient();

  try {
    redis.connect();
  } catch (err) {
    console.error(err);
    return;
  }

  // const repoUser = newRepositoryUser(db);
  const repoBlacklist = newRepositoryBlacklist(redis);
  // const handlerUser = newHandlerUser(repoUser, repoBlacklist);

  const repoContent = newRepositoryContent(db);
  const handlerContent = newHandlerContent(repoContent);
  const port = process.env.PORT || 8000;
  const server = express();

  const handlerMiddleware = new HandlerMiddleware(repoBlacklist);

  server.use(express.json());
  server.use(cors());

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

  server.listen(port, () => console.log(`server listening on ${port}`));
}

main();
