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
    const { material, process, nationality } = req.body;
    if (!material || !process || !nationality) {
      return res
        .status(400)
        .json({
          error: "All filters (material, process, nationality) are required.",
        })
        .end();
    }

    return this.repo
      .getRecipesByFilter(material, process, nationality)
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
}

//     try {
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
//     }
//   }

//   async getRecipeById
//     (req: Request, res: Response): Promise<Response>{

//         try {

//         }
//     const id = Number(req.params.id);

//     // isNaN checks if its arg is NaN
//     if (isNaN(id)) {
//       return res
//         .status(400)
//         .json({ error: `id ${req.params.id} is not a number` });
//     }

//     return this.repo
//       .getContent(id)
//       .then((content) => {
//         if (!content) {
//           return res
//             .status(404)
//             .json({ error: `no such content: ${id}` })
//             .end();
//         }

//         return res.status(200).json(content).end();
//       })
//       .catch((err) => {
//         const errMsg = `failed to get content ${id}: ${err}`;
//         console.error(errMsg);
//         return res.status(500).json({ error: errMsg });
//       });
//   }
