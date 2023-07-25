import { Response, Request } from "express";
import {
  Empty,
  IHandlerContent,
  WithContent,
  WithDelete,
  WithEditComment,
  WithGetComment,
  // WithEditComment,
  WithId,
  WithNewComment,
} from ".";
import { IRepositoryContent } from "../repositories";
// import { IComment } from "../Interfaces/content.interface";
// import { JwtAuthRequest } from "../auth/jwt";

export function newHandlerContent(repo: IRepositoryContent): IHandlerContent {
  return new HandlerContent(repo);
}
class HandlerContent implements IHandlerContent {
  private repo: IRepositoryContent;

  constructor(repo: IRepositoryContent) {
    this.repo = repo;
  }

  async getAllRecipes(req: Request, res: Response): Promise<Response> {
    return this.repo
      .getAllRecipes()
      .then((recipes) => res.status(200).json({ data: recipes }).end())
      .catch((err) => {
        console.error(`failed to create content: ${err}`);
        return res.status(500).json({ error: `failed to get contents` }).end();
      });
  }

  async getRecipesByFilter(
    req: Request<Empty, Empty, Empty, WithContent>,
    res: Response
  ): Promise<Response> {
    // const { material, process, nationality } = req.query;

    const { material, process, nationality, healthy_concern, food_allergen } =
      req.query;

    if (!material && !process && !nationality) {
      return res
        .status(400)
        .json({
          error: "All filters (material, process, nationality) are required.",
        })
        .end();
    }

    return this.repo
      .getRecipesByFilter(
        material,
        process,
        nationality,
        healthy_concern,
        food_allergen
      )
      .then((recipes) => {
        if (!recipes) {
          return res
            .status(404)
            .json({
              error: `no such content: ${material}, ${process}, ${nationality} `,
            })
            .end();
        }
        return res.status(200).json(recipes).end();
      })
      .catch((err) => {
        const errMsg = `failed to get content by filters`;
        console.error(errMsg);
        return res.status(500).json({ error: errMsg });
      });
  }

  //question get/ post for getRecipesByFilters

  async getRecipeById(req: Request, res: Response): Promise<Response> {
    const id = String(req.params.id);
    // question about type of id

    // if (typeof id != String ) {
    //   return res
    //     .status(400)
    //     .json({ error: `id ${req.params.id} is not a number` });
    // }

    return this.repo
      .getRecipeById(id)
      .then((recipe) => {
        if (!recipe) {
          return res
            .status(404)
            .json({ error: `no such content: ${id}` })
            .end();
        }

        return res.status(200).json(recipe).end();
      })
      .catch((err) => {
        const errMsg = `failed to get recipe ${id}: ${err}`;
        console.error(errMsg);
        return res.status(500).json({ error: errMsg });
      });
  }

  async createCommentAndUpdateToContent(
    req: Request<WithId, Empty, WithNewComment>,
    res: Response
  ): Promise<Response> {
    const content_id = String(req.params.id);

    const { description, rating, display_name, user_id } = req.body;

    if (!req.body) {
      return res.status(400).json({ error: "missing msg in json body" }).end();
    }

    try {
      await this.repo.createCommentAndUpdateToContent(
        content_id,
        description,
        rating,
        display_name,
        user_id
      );

      const updated = await this.repo.updateAverageRatingForContent(content_id);

      return res.status(201).json(updated).end();
    } catch (err) {
      const errMsg = `failed to create comment and update to content ${content_id}: ${err}`;
      console.error(errMsg);
      return res.status(500).json({ error: errMsg }).end();
    }
  }

  async editComment(
    req: Request<WithId, Empty, WithEditComment>,
    res: Response
  ): Promise<Response> {
    const content_id = String(req.params.id);
    const { comment_id, description, rating } = req.body;

    if (!req.body) {
      return res.status(400).json({ error: "missing msg in json body" }).end();
    }

    try {
      await this.repo.editComment(content_id, comment_id, description, rating);
      const updated = await this.repo.updateAverageRatingForContent(content_id);

      return res.status(201).json(updated).end();
    } catch (err) {
      const errMsg = `failed to edit comment ${content_id}: ${err}`;
      console.error(errMsg);
      return res.status(500).json({ error: errMsg }).end();
    }
  }

  async deleteCommentById(
    req: Request<WithId, Empty, WithDelete>,
    res: Response
  ): Promise<Response> {
    const content_id = String(req.params.id);
    const { comment_id } = req.body;

    try {
      await this.repo.deleteCommentById(content_id, comment_id);

      const updated = await this.repo.updateAverageRatingForContent(content_id);

      return res.status(201).json(updated).end();
    } catch (err) {
      const errMsg = `failed to create comment and update to content ${content_id}: ${err}`;
      console.error(errMsg);
      return res.status(500).json({ error: errMsg }).end();
    }
  }

  async getCommentById(
    req: Request<WithId, Empty, Empty, WithGetComment>,
    res: Response
  ): Promise<Response> {
    const content_id = String(req.params.id);

    const { comment_id } = req.query;

    if (!comment_id) {
      return res
        .status(400)
        .json({
          error: "material_id are required.",
        })
        .end();
    }

    return this.repo
      .getCommentById(content_id, comment_id)
      .then((comment) => {
        if (!comment) {
          return res
            .status(404)
            .json({ error: `no such comment: ${comment_id}` })
            .end();
        }

        return res.status(200).json(comment).end();
      })
      .catch((err) => {
        const errMsg = `failed to get recipe ${comment_id}: ${err}`;
        console.error(errMsg);
        return res.status(500).json({ error: errMsg });
      });
  }
}

//     try {
// .then((updated) => res.status(201).json(updated))
// .catch((err) => {
//   const errMsg = `failed to create comment and update to content ${content_id}: ${err}`;
//   console.error(errMsg);
//   return res.status(500).json({ error: errMsg }).end();
// });
//       //   console.log(req.body);
//       const { material, process, nationality } = req.body;

//       // Ensure all required filters are provided
//       if (!material || !process || !nationality) {
//         return res
//           .status(400)
//           .json({
//             error: "All filters (material, process, nationality) are required.",
//           })
//           .end();
//       }

//       //   console.log("A", typeof material, typeof process, typeof nationality);

//       const recipes = await this.repo.getRecipesByFilter(
//         material,
//         process,
//         nationality
//       );

//       //   console.log("handler", recipes);

//       return res.status(200).json(recipes).end();
//     } catch (error) {
//       console.error("Failed to get Recipes by filters", error);
//       return res
//         .status(500)
//         .json({ error: "Failed to get Recipes by filters" });
