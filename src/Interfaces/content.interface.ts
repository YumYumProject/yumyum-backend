import { Document, ObjectId } from "mongoose";

// import { QueryResult } from "../paginate/paginate";
// import { AccessAndRefreshTokens } from "../token/token.interfaces";

// export interface IContent extends Document {
//   menu_name: string;
//   description: string;
//   menu_image_url: sstring;
//   calories: Enumerator;
//   process: Enumerator;
//   nationality: Enumerator;
//   healthy_concern: Enumerator;
//   material: [{ name: string; quantity: number; unit: string }];
//   cooking_step: [{ order: number; description: string }];
//   updated_at: Date;
//   comment: [{ description: string; commentBy: string; commentedAt: Date }];
//   rating: [{ value: number; user: { id: ObjectId } }];
// }

export interface IMaterial extends Document {
  name: string;
  quantity: number;
  unit: string;
}

export interface ICookingStep extends Document {
  order: number;
  description: string;
}

export interface IComment extends Document {
  description: string;
  rating: number;
  commentBy: string;
  commentedAt: Date;
}

// export interface IRating extends Document {
//   value: number;
//   user: { id: ObjectId };
// }
export interface ICalories extends Document {
  value: number;
  unit: string;
}

export interface IContent extends Document, IContentDto {
  _id: ObjectId;
  description: string;

  calories: ICalories;
  process: Enumerator;
  nationality: Enumerator;
  healthy_concern: Enumerator;
  material: IMaterial[];
  cooking_step: ICookingStep[];
  updated_at: Date;
  comment: IComment[];

  rating_count: number;
}

export interface IContentDto extends Document {
  menu_name: string;
  menu_image_url: string;
  average_rating: number;
}
