import "dotenv/config";
// import { contentSchema } from "../models/content.model";
// import { IComment, IContent } from "../Interfaces/content.interface";
// import { IRepositoryContent } from "./index";
import mongoose from "mongoose";
// import { contentModel, contentSchema } from "../models/content.model";
// import { commentModel } from "../models/comment.model";
import { contentModel } from "../models/content.model";
import { commentModel } from "../models/comment.model";
import { IContent } from "../Interfaces/content.interface";

// import data from "../../recipe.js";
// import { CommentSchema } from "../models/comment.model";

mongoose.set("strictQuery", true);

mongoose.connect(
  `mongodb+srv://${process.env.USERNAME}:${process.env.PASSWORD}@cluster0.pqbm4xu.mongodb.net/EazyEat?retryWrites=true&w=majority`
);

// interface QueryFilter {
//   ["material.name"]?: object;
//   process?: object;
//   nationality?: object;
// }

// export function newRepositoryContent(db: Mongoose): IRepositoryContent {
//   return new RepositoryContent(db);
// }
// class RepositoryContent implements IRepositoryContent {
//   private db: Mongoose;
//   private contentModel: Model<IContent>;
//   private commentModel: Model<IComment>;

//   constructor(db: Mongoose) {
//     this.db = db;
//     this.contentModel = this.db.model<IContent>("content", contentSchema);
//     this.commentModel = this.db.model<IComment>("comment", CommentSchema);
//   }

//   async createContent() {
//     data.forEach(async (item) => {
//       const model = new this.contentModel(item);
//       await model
//         .save()
//         .then(() => console.log("Content created successfully"))
//         .catch((err) => console.error(err));
//     });

//     console.log("Data imported successfully");
//   }

//   async getAllRecipes(): Promise<IContent[]> {
//     return await this.contentModel
//       .find(
//         {},
//         {
//           menu_name: true,
//           menu_image_url: true,
//           average_rating: true,
//           _id: true,
//         }
//       )
//       .exec();
//   }

//   async getRecipesByFilter(
//     material: string,
//     process: string,
//     nationality: string
//   ): Promise<IContent[]> {
//     console.log(material);
//     console.log(process);
//     console.log(nationality);

//     const query: QueryFilter = {
//       "material.name": { $in: material },
//       process: { $in: process },
//       nationality: { $in: nationality },
//     };

//     if (nationality == "All") {
//       delete query["nationality"];
//     }

//     if (process == "All") {
//       delete query["process"];
//     }

//     console.log(query);

//     const recipes = await this.contentModel
//       .find(
//         query,
//         //Projection >> select field that you want to show
//         {
//           menu_name: true,
//           menu_image_url: true,
//           average_rating: true,
//           _id: true,
//         }
//       )
//       .exec();

//     console.log("repo", recipes);
//     return recipes;
//   }

//   async getRecipeById(id: string): Promise<IContent | null> {
//     try {
//       const recipe = await this.contentModel.findById(id);

//       if (!recipe) {
//         return Promise.reject(`recipe ${id} not found`);
//       }
//       console.log(recipe);
//       return Promise.resolve(recipe);
//     } catch (error) {
//       return Promise.reject(`failed to get content ${id}:${error}`);
//     }
//   }

//   //   async createCommentAndAddToContent(
//   //     _id: string,
//   //     commentByUser: IComment
//   //     // commentedAt: Date;
//   //   ): Promise<IContent> {
//   //     // Create a comment
//   //     const comment = new Comment(commentByU);
//   //     await comment.save();

//   //     // Update the content with the new comment
//   //     const updatedContent = await this.contentModel
//   //       .findOneAndUpdate(
//   //         { _id: contentId },
//   //         { $push: { comments: comment._id } },
//   //         { new: true } // Returns the modified document rather than the original
//   //       )
//   //       .populate("comments");

//   //     return updatedContent;
//   //   }
//   // }
// }
// async function updateUserContent(arg: {
//   contentId: string;
//   comment: string;
//   rating: number;
// }): Promise<IContent> {
//   const updatedcomment = await contentModel.findOneAndUpdate(
//     { _id: Object(arg.contentId) },
//     { comments: arg.comment, rating: arg.rating }
//   );

//   if (!updatedcomment) {
//     return Promise.reject(`no such content ${arg.contentId}`);
//   }

//   // if (updatedcomment.userId !== arg.userId) {
//   //   return Promise.reject(`bad userId: ${arg.userId}`);
//   // }
//   return updatedcomment;
// }

// updateUserContent({
//   contentId: "64b7804f60ef0973d0bfb4bf",
//   comment: "Good",
//   rating: 4,
// });

// async createCommentAndAddToContent(contentId: string, commentText: string): Promise<IContent | null> {
//       // Create a comment
//       const comment = new Comment({ text: commentText });
//       await comment.save();

//       // Update the content with the new comment
//       const updatedContent = await Content.findOneAndUpdate(
//           { _id: contentId },
//           { $push: { comments: comment._id } },
//           { new: true }  // Returns the modified document rather than the original
//       ).populate('comments');

//       return updatedContent;
//   }

// async function createContent() {
//   const newContent: IContent = new contentModel({
//     data.forEach(element => {newContent.

//     });

//   menu_name: "สปาเกตตี้คาโบนาร่า",
//   description: "",
//   menu_image_url:
//     "https://img.salehere.co.th/p/1200x0/2021/09/07/1mwq6tqejkdw.jpg",
//   calories: { value: 317, unit: "กิโลแคลอรี่" },
//   process: "ผัด",
//   nationality: "อิตาเลี่ยน",
//   healthy_concern: ["เบาหวาน", "อ้วน"],
//   material: [
//     { name: "เส้นสปาเก็ตตี้", quantity: 100, unit: "กรัม" },
//     { name: "เบคอน", quantity: 150, unit: "กรัม" },
//     { name: "พาเมซานชีส", quantity: 40, unit: "กรัม" },
//     { name: "ไข่ไก่ ", quantity: 4, unit: "ฟอง" },
//     { name: "เกลือ", quantity: 1, unit: "ช้อนชา" },
//     { name: "น้ำสะอาด", quantity: 50, unit: "มิลลิลิตร" },
//   ],
//   cooking_step: [
//     { order: 1, descriiption: "นำเบคอนมาหั่นเป็นชิ้นขนาดตามต้อมการ" },
//     {
//       order: 2,
//       descriiption:
//         "นำไข่ไก่สดมาแยกไข่แดงออกจากไข่ขาว โดยใช้เฉพาะไข่แดงอย่างเดียว 3 ฟอง และไข่ไก่ทั้งใบ 1 ฟอง",
//     },
//     {
//       order: 3,
//       descriiption:
//         "นำพาเมซานชีสที่ขูดแล้วมาผสมกับไข่ไก่ จากนั้นใส่พริกไทย และเกลือ คนผสมให้เข้ากัน",
//     },
//     {
//       order: 4,
//       descriiption:
//         "ต้มน้ำให้เดือด แล้วใส่เกลือลงไป จากนั้นใส่เส้นสปาเก็ตตี้ลงไปต้ม ใช้เวลาต้มประมาณ 6 นาที",
//     },
//     {
//       order: 5,
//       descriiption:
//         "นำเบคอนมาผัดในกระทะจนเหลืองหอม และเริ่มมีน้ำมันออกมา จากนั้นใส่เส้นสปาก็ตตี้ที่ต้มเสร็จแล้วลงไป ผัดจนน้ำมันเบคอนเคลือบเส้นดี เติมน้ำเดือดที่ใช้ต้มเส้นลงไปเล็กน้อย",
//     },
//     {
//       order: 6,
//       descriiption:
//         "ปิดเตาแก๊ส จากนั้นใส่ส่วนผสมของไข่และชีสลงไป แล้วคลุกเคล้าให้เข้ากับเส้นสปาเก็ตตี้",
//     },
//   ],
// });

//   newContent
//     .save()
//     .then(() => console.log("Content created successfully"))
//     .catch((err) => console.error(err));
// }

// async function createComment(
//   description: string,
//   rating: number,
//   displayName: string,
//   userId: string
// ) {
//   const comment = new commentModel({
//     description,
//     rating,
//     comment_by: {
//       display_name: displayName,
//       user_id: userId,
//     },
//   });

//   return await comment.save();
// }
// createComment("Good", 5, "gg", "64b958d4d07717158eefdc42");

// async function addCommentToContent(contentId: string, commentId: string) {
//   return await contentModel.findOneAndUpdate(
//     { _id: contentId },
//     { $push: { comment: commentId } },
//     { new: true }
//   );
// }

// addCommentToContent("64b7804f60ef0973d0bfb4bf", "64bbef074b502a3d142b5f13");

async function createCommentAndUpdateContent(
  contentId: string,
  description: string,
  rating: number,
  displayName: string,
  userId: string
): Promise<IContent> {
  const comment = new commentModel({
    description,
    rating,
    comment_by: {
      display_name: displayName,
      user_id: userId,
    },
  });

  if (!comment) {
    return Promise.reject(`no such comment`);
  }

  const savedComment = await comment.save();

  const res = await contentModel.findOneAndUpdate(
    { _id: contentId },
    { $push: { comment: savedComment } },
    { new: true }
  );

  if (!res) return Promise.reject("Comment not found");

  return Promise.resolve(res);

  // return await contentModel
  //   .findOneAndUpdate(
  //     { _id: contentId },
  //     { $push: { comment: savedComment._id } },
  //     { new: true }
  //   )
  //   .then((res) => res)
  //   .catch((err) => console.error(err));
}

//     console.log("Data imported successfully");

createCommentAndUpdateContent(
  "64b7804f60ef0973d0bfb4cf",
  "Aroi",
  3,
  "M",
  "64b78131dd55d107e4e5fccc"
);
