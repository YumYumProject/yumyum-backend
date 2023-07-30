import { Response, Request } from "express";
import {
  AppRequest,
  Empty,
  IHandlerContent,
  Recipes,
  WithComment,
  WithContent,
  WithDelete,
  WithEditComment,
  WithGetComment,
  // WithEditComment,
  WithId,
  WithNewComment,
  WithUserId,
} from ".";
import { IRepositoryContent } from "../repositories";
import { JwtAuthRequest } from "../auth/jwt";
// import { IComment } from "../Interfaces/content.interface";
// import { JwtAuthRequest } from "../auth/jwt";

// interface Recipes {
//     _id: string;
//     menu_name: string;
//     menu_image_url: string;
//     average_rating: number;
// }


export function newHandlerContent(repo: IRepositoryContent): IHandlerContent {
  return new HandlerContent(repo);
}
class HandlerContent implements IHandlerContent {
  private repo: IRepositoryContent;

  constructor(repo: IRepositoryContent) {
    this.repo = repo;
  }

  // async getAllRecipes(
  //   req: AppRequest<Empty, Empty, Empty>,
  //   // req: Request,
  //   res: Response
  // ): Promise<Response> {
  //   return this.repo
  //     .getAllRecipes()
  //     .then((recipes) => res.status(200).json({ data: recipes }).end())
  //     .catch((err) => {
  //       console.error(`failed to create content: ${err}`);
  //       return res.status(500).json({ error: `failed to get contents` }).end();
  //     }); 
  // }




  async getAllRecipes(
    req: AppRequest<Empty, Empty, Empty>,
    // req: Request,
    res: Response
  ): Promise<Response> {

    const sortRecipesByRating = (recipes: Recipes[]): Recipes[] => {
    return recipes.sort((a, b) => b.average_rating - a.average_rating);
}


    return this.repo
      .getAllRecipes()
      .then((recipes) => {
            const sortedRecipes = sortRecipesByRating(recipes);
            return res.status(200).json({ data: sortedRecipes }).end();
        })
      .catch((err) => {
        console.error(`failed to create content: ${err}`);
        return res.status(500).json({ error: `failed to get contents` }).end();
      }); 
  }

  

async getThreeTopRecipes(
    req: AppRequest<Empty, Empty, Empty>,
    // req: Request,
    res: Response
  ): Promise<Response> {

    const getTopRatedRecipes = (recipes: Recipes[], topN: number): Recipes[] => {
    return recipes.sort((a, b) => b.average_rating - a.average_rating)
    .slice(0, topN);
}


    return this.repo
      .getAllRecipes()
      .then((recipes) => {
            const topRatedRecipes = getTopRatedRecipes(recipes, 3);
            return res.status(200).json({ data: topRatedRecipes }).end();
        })
      .catch((err) => {
        console.error(`failed to create content: ${err}`);
        return res.status(500).json({ error: `failed to get contents` }).end();
      }); 
  }


  async getRecipesByFilter(
    req: AppRequest<Empty, Empty, WithContent>,
    // req: Request<Empty, Empty, Empty, WithContent>,
    res: Response
  ): Promise<Response> {
    // const { material, process, nationality } = req.query;

       const sortRecipesByRating = (recipes: Recipes[]): Recipes[] => {
    return recipes.sort((a, b) => b.average_rating - a.average_rating);
}

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
       const sortedRecipes = sortRecipesByRating(recipes);
       
            return res.status(200).json(sortedRecipes ).end();
      })
      .catch((err) => {
        const errMsg = `failed to get content by filters`;
        console.error(errMsg);
        return res.status(500).json({ error: errMsg });
      });
  }

  //question get/ post for getRecipesByFilters

  async getRecipeById(
    req: AppRequest<WithId, Empty, Empty>,
    res: Response
  ): Promise<Response> {
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
    req: JwtAuthRequest<WithId, WithNewComment, Empty>,
    // req: Request<WithId, Empty, WithNewComment>,
    res: Response
  ): Promise<Response> {
    const content_id = String(req.params.id);

    const display_name = req.payload.display_name;
    const user_id = req.payload.user_id;

    // if (!user_id) {
    //   return res.status(400).end();
    // }

    const { description, rating } = req.body;
    //  const { description, rating, user_id } = req.body;

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

  // async editComment(
  //   req: JwtAuthRequest<WithId, WithComment, WithEditComment>,
  //   // req: Request<WithId, Empty, WithComment, WithEditComment>,
  //   res: Response
  // ): Promise<Response> {
  //   const { user_id, username, display_name } = req.payload;
  //   const content_id = String(req.params.id);
  //   const { comment_id } = req.query;

  //   const { description, rating } = req.body;

  //   if (!req.body) {
  //     return res.status(400).json({ error: "missing msg in json body" }).end();
  //   }

  //   try {
  //     const x = await this.repo.getCommentById(content_id, comment_id);
  //     if (user_id === String(x.comment[0].comment_by.user_id))
  //       await this.repo.editComment(
  //         content_id,
  //         comment_id,
  //         description,
  //         rating
  //       );
  //     else
  //       return res
  //         .status(403)
  //         .json({ error: "user is not authorized to update the comment" })
  //         .end();
  //     const updated = await this.repo.updateAverageRatingForContent(content_id);

  //     return res.status(201).json(updated).end();
  //   } catch (err) {
  //     const errMsg = `failed to edit comment ${content_id}: ${err}`;
  //     console.error(errMsg);
  //     return res.status(500).json({ error: errMsg }).end();
  //   }
  // }

  async editComment(
    req: JwtAuthRequest<WithId, WithComment, WithEditComment>,
    // req: Request<WithId, Empty, WithComment, WithEditComment>,
    res: Response
  ): Promise<Response> {
    const { user_id } = req.payload;
    const content_id = String(req.params.id);
    const { comment_id } = req.query;

    const { description, rating } = req.body;

    if (!req.body) {
      return res.status(400).json({ error: "missing msg in json body" }).end();
    }

    try {
      // const x = await this.repo.getCommentById(content_id, comment_id);
      // if (user_id === String(x.comment[0].comment_by.user_id))
      await this.repo.editComment(
        user_id,
        content_id,
        comment_id,
        description,
        rating
      );
      // else
      //   return res
      //     .status(403)
      //     .json({ error: "user is not authorized to update the comment" })
      //     .end();
      const updated = await this.repo.updateAverageRatingForContent(content_id);

      return res.status(201).json(updated).end();
    } catch (err) {
      const errMsg = `failed to edit comment ${content_id}: ${err}`;
      console.error(errMsg);
      return res.status(500).json({ error: errMsg }).end();
    }
  }

  async deleteCommentById(
    req: JwtAuthRequest<WithId, WithUserId, WithDelete>,
    // req: Request<WithId, Empty,Empty, WithDelete>,
    res: Response
  ): Promise<Response> {
    const content_id = String(req.params.id);
    const { comment_id } = req.query;
    const { user_id } = req.payload;

    try {
      await this.repo.deleteCommentById(user_id, content_id, comment_id);

      const updated = await this.repo.updateAverageRatingForContent(content_id);

      return res.status(201).json(updated).end();
    } catch (err) {
      const errMsg = `failed to create comment and update to content ${content_id}: ${err}`;
      console.error(errMsg);
      return res.status(500).json({ error: errMsg }).end();
    }
  }

  async getCommentById(
    req: JwtAuthRequest<WithId, WithUserId, WithGetComment>,
    // req: Request<WithId, Empty, Empty, WithGetComment>,
    res: Response
  ): Promise<Response> {
    const content_id = String(req.params.id);

    const user_id = req.payload.user_id;

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
      .getCommentById(user_id, content_id, comment_id)
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
        const errMsg = `failed to get recipe ${content_id}: ${err}`;
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
