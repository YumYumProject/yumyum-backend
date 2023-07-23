import "dotenv/config";
import { contentSchema } from "../models/content.model";
import { IComment, IContent } from "../Interfaces/content.interface";
import { IRepositoryContent } from "./index";
import { Model, Mongoose } from "mongoose";

import data from "../../recipe.js";
import { commentSchema } from "../models/comment.model";

// mongoose.set("strictQuery", true);

// mongoose.connect(
//   `mongodb+srv://${process.env.USERNAME}:${process.env.PASSWORD}@cluster0.pqbm4xu.mongodb.net/EazyEat?retryWrites=true&w=majority`
// );

interface QueryFilter {
  ["material.name"]?: object;
  process?: object;
  nationality?: object;
}

export function newRepositoryContent(db: Mongoose): IRepositoryContent {
  return new RepositoryContent(db);
}
class RepositoryContent implements IRepositoryContent {
  private db: Mongoose;
  private contentModel: Model<IContent>;
  private commentModel: Model<IComment>;

  constructor(db: Mongoose) {
    this.db = db;
    this.contentModel = this.db.model<IContent>("content", contentSchema);
    this.commentModel = this.db.model<IComment>("comment", commentSchema);
  }

  async createContent() {
    data.forEach(async (item) => {
      const model = new this.contentModel(item);
      await model
        .save()
        .then(() => console.log("Content created successfully"))
        .catch((err) => console.error(err));
    });

    console.log("Data imported successfully");
  }

  async getAllRecipes(): Promise<IContent[]> {
    return await this.contentModel
      .find(
        {},
        {
          menu_name: true,
          menu_image_url: true,
          average_rating: true,
          _id: true,
        }
      )
      .exec();
  }

  async getRecipesByFilter(
    material: string,
    process: string,
    nationality: string
  ): Promise<IContent[]> {
    console.log(material);
    console.log(process);
    console.log(nationality);

    const query: QueryFilter = {
      "material.name": { $in: material },
      process: { $in: process },
      nationality: { $in: nationality },
    };

    if (nationality == "All") {
      delete query["nationality"];
    }

    if (process == "All") {
      delete query["process"];
    }

    console.log(query);

    const recipes = await this.contentModel
      .find(
        query,
        //Projection >> select field that you want to show
        {
          menu_name: true,
          menu_image_url: true,
          average_rating: true,
          _id: true,
        }
      )
      .exec();

    console.log("repo", recipes);
    return recipes;
  }

  async getRecipeById(id: string): Promise<IContent | null> {
    try {
      const recipe = await this.contentModel.findById(id);

      if (!recipe) {
        return Promise.reject(`recipe ${id} not found`);
      }
      console.log(recipe);
      return Promise.resolve(recipe);
    } catch (error) {
      return Promise.reject(`failed to get content ${id}:${error}`);
    }
  }

  async createCommentAndUpdateToContent(
    content_id: string,
    description: string,
    rating: number,
    display_name: string,
    user_id: string
  ): Promise<IContent> {
    const comment = new this.commentModel({
      description,
      rating,
      comment_by: {
        display_name: display_name,
        user_id: user_id,
      },
    });

    if (!comment) {
      return Promise.reject(`no such comment`);
    }

    const savedComment = await comment.save();

    const res = await this.contentModel.findOneAndUpdate(
      { _id: content_id },
      { $push: { comment: savedComment } },
      { new: true }
    );

    if (!res) return Promise.reject("Comment not found");

    // console.log("Data imported successfully");
    return Promise.resolve(res);
  }

  async updateAverageRatingForContent(contentId: string): Promise<IContent> {
    const content = await this.contentModel
      .findById(contentId)
      .populate("comment");
    if (!content) {
      throw new Error("Content not found");
    }

    const totalRatings = content.comment.reduce(
      (acc, comment: IComment) => acc + comment.rating,
      0
    );
    const averageRating = totalRatings / content.comment.length;
    const roundedAverageRating = Math.round(averageRating);

    content.average_rating = roundedAverageRating;
    content.rating_count = content.comment.length;

    return await content.save();
  }
}

// createCommentAndUpdateToContent(
//   "64b7804f60ef0973d0bfb4cf",
//   "Aroi",
//   3,
//   "M",
//   "64b78131dd55d107e4e5fccc"
// );

// return await contentModel
//   .findOneAndUpdate(
//     { _id: contentId },
//     { $push: { comment: savedComment._id } },
//     { new: true }
//   )
//   .then((res) => res)
//   .catch((err) => console.error(err));
