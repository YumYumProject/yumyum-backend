import mongoose from "mongoose";
import { newRepositoryContent } from "./repositories/content";
import { newHandlerContent } from "./handlers/content";
import express from "express";
import cors from "cors";

async function main() {
  const db = await mongoose.connect(
    `mongodb+srv://${process.env.USERNAME}:${process.env.PASSWORD}@cluster0.pqbm4xu.mongodb.net/EazyEat?retryWrites=true&w=majority`
  );

  const repoContent = newRepositoryContent(db);
  const handlerContent = newHandlerContent(repoContent);
  const port = process.env.PORT || 8000;
  const server = express();

  server.use(express.json());
  server.use(cors());

  const contentRouter = express.Router();
  server.use("/content", contentRouter);

  contentRouter.post(
    "/",
    handlerContent.getRecipesByFilter.bind(handlerContent)
  );

  contentRouter.get("/:id", handlerContent.getRecipeById.bind(handlerContent));

  server.get("/", (req, res) => {
    res.send("Hello, world!");
  });

  server.listen(port, () => console.log(`server listening on ${port}`));
}

main();
