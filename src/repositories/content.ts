import "dotenv/config";
import { contentSchema } from "../models/content.model";
import {
  IComment,
  IContent,
  IGetComment,
} from "../Interfaces/content.interface";
import { IRepositoryContent } from "./index";
import mongoose, { Model, Mongoose, ObjectId } from "mongoose";

import data from "../../recipeU";
import { commentSchema } from "../models/comment.model";
// import { commentSchema } from "../models/comment.model";

// mongoose.set("strictQuery", true);

// mongoose.connect(
//   `mongodb+srv://${process.env.USERNAME}:${process.env.PASSWORD}@cluster0.pqbm4xu.mongodb.net/EazyEat?retryWrites=true&w=majority`
// );

// interface QueryFilter {
//   ["material.name"]?: object;
//   process?: object;
//   nationality?: object;
//   healthy_concern?: object;
// }

interface QueryFilter {
  "material.name"?: {
    $regex?: string;
    $not?: {
      $regex: string;
    };
  };
  process?: {
    $in: string;
  };
  healthy_concern?: {
    $in: string;
  };
  nationality?: {
    $in: string;
  };
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

  // async addNewRecipes() {
  //   data.forEach(async(item) => {
  //     return await this.contentModel.
  // })
  // }

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

  // async getRecipesByFilter(
  //   material: string,
  //   process: string,
  //   nationality: string,
  //   healthy_concern: string,
  //   food_allergen: string
  // ): Promise<IContent[]> {
  //   console.log(material);
  //   console.log(process);
  //   console.log(nationality);

  //   const query: QueryFilter = {
  //     "material.name": { $nin: food_allergen, $in: material },
  //     process: { $in: process },
  //     healthy_concern: { $in: healthy_concern },
  //     nationality: { $in: nationality },
  //   };

  //   if (nationality == "All") {
  //     delete query["nationality"];
  //   }

  //   if (process == "All") {
  //     delete query["process"];
  //   }

  //   console.log(query);

  //   const recipes = await this.contentModel
  //     .find(
  //       query,
  //       //Projection >> select field that you want to show
  //       {
  //         menu_name: true,
  //         menu_image_url: true,
  //         average_rating: true,
  //         _id: true,
  //       }
  //     )
  //     .exec();

  //   console.log("repo", recipes);
  //   return recipes;
  // }

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

  //__________________________

  // async getRecipesByFilter(
  //   material: string,
  //   process: string,
  //   nationality: string,
  //   healthy_concern: string,
  //   food_allergen: string
  // ): Promise<IContent[]> {
  //   console.log(material);
  //   console.log(process);
  //   console.log(nationality);

  //   const query: QueryFilter = {
  //     "material.name": {
  //       $regex: material,
  //       // if food_allergen is empty, this condition shouldn't be included in the query at first place
  //       $not: { $regex: food_allergen },
  //     },
  //     process: { $in: process },
  //     healthy_concern: { $in: healthy_concern },
  //     nationality: { $in: nationality },
  //   };

  //   if (nationality === "All") {
  //     delete query["nationality"];
  //   }

  //   if (process === "All") {
  //     delete query["process"];
  //   }

  //   console.log("food allergen",typeof food_allergen)

  //   if (food_allergen === "") {
  //     delete query["food_allergen"];
  //   }

  //   if (healthy_concern === "") {
  //     delete query["healthy_concern"];
  //   }

  //   console.log("query" ,query);

  //   const recipes = await this.contentModel
  //     .find(
  //       query,
  //       //Projection >> select field that you want to show
  //       {
  //         menu_name: true,
  //         menu_image_url: true,
  //         average_rating: true,
  //         _id: true,
  //       }
  //     )
  //     .exec();

  //   console.log("repo", recipes);
  //   return recipes;
  // }

  //__________________________

  async getRecipesByFilter(
    material: string,
    process: string,
    nationality: string,
    healthy_concern: string,
    food_allergen: string
  ): Promise<IContent[]> {
    console.log(material);
    console.log(process);
    console.log(nationality);

    const query: QueryFilter = {
      process: { $in: process },
      healthy_concern: { $in: healthy_concern },
      nationality: { $in: nationality },
    };

    // Add condition for material name based on the material input value
    if (material) {
      query["material.name"] = { $regex: material };
    }

    // If food_allergen is not an empty string, modify the material.name condition to include the $not condition
    if (food_allergen) {
      if (!query["material.name"]) {
        query["material.name"] = {}; // Initialize it if it doesn't exist
      }
      query["material.name"].$not = { $regex: food_allergen };
    }

    if (nationality === "All") {
      delete query["nationality"];
    }

    if (process === "All") {
      delete query["process"];
    }

    console.log("food allergen", typeof food_allergen);

    if (food_allergen === "") {
      delete query["food_allergen"];
    }

    if (healthy_concern === "") {
      delete query["healthy_concern"];
    }

    console.log("query", query);

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

  // async getRecipeById(id: string): Promise<IContent | null> {
  //   try {
  //     const recipe = await this.contentModel.findById(id);

  //     if (!recipe) {
  //       return Promise.reject(`recipe ${id} not found`);
  //     }
  //     console.log(recipe);
  //     return Promise.resolve(recipe);
  //   } catch (error) {
  //     return Promise.reject(`failed to get content ${id}:${error}`);
  //   }
  // }

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

    // const savedComment = await comment.save();

    const res = await this.contentModel.findOneAndUpdate(
      { _id: content_id },
      { $push: { comment } },
      { new: true }
    );

    if (!res) return Promise.reject("Comment not found");

    // console.log("Data imported successfully");
    return Promise.resolve(res);
  }

  async updateAverageRatingForContent(contentId: string): Promise<IContent> {
    const content = await this.contentModel.findById(contentId);
    // .populate("comment");
    if (!content) {
      throw new Error("Content not found");
    }

    console.log("from updateRating", content);

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

  async editComment(
    user_id: string,
    content_id: string,
    comment_id: string,
    newDescription: string,
    newRating: number
  ): Promise<IContent> {
    try {
      const res = await this.contentModel.findOneAndUpdate(
        { _id: content_id, "comment._id": comment_id },
        {
          $set: {
            "comment.$.description": newDescription,
            "comment.$.rating": newRating,
          },
        }
      );

      // console.log("Hi from repo");
      if (!res) {
        return Promise.reject(`no such comment`);
      }

      if (res.comment[0].comment_by.user_id !== user_id) {
        return Promise.reject(`bad userId: ${user_id}`);
      }

      // console.log("gibbbbbbbbbbbbbbbbbbb\n\n\n\n\n");

      // const c = res.comment[0];

      return Promise.resolve(res);
    } catch (err) {
      console.log(err);
      return Promise.reject("edit failed");
    }
  }

  async deleteCommentById(
    user_id: string,
    content_id: string,
    comment_id: string
  ): Promise<void> {
    if (!user_id) {
      return Promise.reject(`failed to authorize`);
    }
    return await this.contentModel
      .updateOne(
        { _id: content_id },
        { $pull: { comment: { _id: comment_id } } }
      )
      .then((_) => Promise.resolve())
      .catch((err) =>
        Promise.reject(`failed to delete content ${content_id}: ${err}`)
      );
  }

  async getCommentById(
    user_id: string,
    content_id: string,
    comment_id: string
  ): Promise<IComment> {
    try {
      const comment = await this.contentModel.findOne(
        { _id: content_id, "comment._id": comment_id },
        { "comment.$": 1 } // This projection selects only the matching comment from the array
      );
      // console.log(comment);

      if (!comment) {
        return Promise.reject(`comment ${comment_id} not found`);
      }

      if (String(comment.comment[0].comment_by.user_id) !== user_id) {
        return Promise.reject(`bad userId: ${user_id}`);
      }

      return Promise.resolve(comment.comment[0]);
    } catch (error) {
      return Promise.reject(`failed to get comment ${comment_id}:${error}`);
    }
  }
}
