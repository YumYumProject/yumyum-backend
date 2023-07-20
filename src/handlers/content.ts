import { Response, Request } from "express";
import { IHandlerContent } from ".";
import { IRepositoryContent } from "../repositories";

export function newHandlerContent(repo: IRepositoryContent) {
  return new HandlerContent(repo);
}
class HandlerContent implements IHandlerContent {
  private repo: IRepositoryContent;

  constructor(repo: IRepositoryContent) {
    this.repo = repo;
  }

  async getRecipesByFilter(req: Request, res: Response): Promise<Response> {
    try {
      //   console.log(req.body);
      const { material, process, nationality } = req.body;

      // Ensure all required filters are provided
      if (!material || !process || !nationality) {
        return res
          .status(400)
          .json({
            error: "All filters (material, process, nationality) are required.",
          })
          .end();
      }

      //   console.log("A", typeof material, typeof process, typeof nationality);

      const recipes = await this.repo.getRecipesByFilter(
        material,
        process,
        nationality
      );

      //   console.log("handler", recipes);

      return res.status(200).json(recipes).end();
    } catch (error) {
      console.error("Failed to get Recipes by filters", error);
      return res
        .status(500)
        .json({ error: "Failed to get Recipes by filters" });
    }
  }
}
