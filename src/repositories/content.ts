import "dotenv/config";
import { contentSchema } from "../models/content.model";
import { IContent } from "../Interfaces/content.interface";
import { IRepositoryContent } from "./index";
import { Model, Mongoose } from "mongoose";
import data from "../../recipe.js";

// mongoose.set("strictQuery", true);

// mongoose.connect(
//   `mongodb+srv://${process.env.USERNAME}:${process.env.PASSWORD}@cluster0.pqbm4xu.mongodb.net/EazyEat?retryWrites=true&w=majority`
// );

export function newRepositoryContent(db: Mongoose): IRepositoryContent {
  return new RepositoryContent(db);
}
class RepositoryContent implements IRepositoryContent {
  private db: Mongoose;
  private contentModel: Model<IContent>;

  constructor(db: Mongoose) {
    this.db = db;
    this.contentModel = this.db.model<IContent>("content", contentSchema);
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

  async getAllRecipes (): Promise<IContent[]> {
    return await this.contentModel.find(  
      {
        },
        {
          menu_name: true,
          menu_image_url: true,
          average_rating: true,
          _id: true,
        }
      ).exec();
  }

 

  async getRecipesByFilter(
    material: string,
    process: string,
    nationality: string
  ): Promise<IContent[]> {
    console.log(material);
    console.log(process);
    console.log(nationality);

    const recipes = await this.contentModel
      .find(
        {
          $and: [
            { "material.name": { $in: material } },
            { process: { $in: process } },
            { nationality: { $in: nationality } },
          ],
        },

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
}

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
