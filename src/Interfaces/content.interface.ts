import { Document, ObjectId } from "mongoose";

export interface IMaterial extends Document {
  name: string;
  quantity: number;
  unit: string;
}

export interface ICookingStep extends Document {
  order: number;
  description: string;
}

export interface IComment {
  content_id: ObjectId;
  _id: ObjectId;
  description: string;
  rating: number;
  comment_by: ICommentBy;
  commentedAt: Date;
}

export interface IGetComment {
  id: ObjectId;
  description: string;
  rating: number;
  comment_by: ICommentBy;
  commentedAt: Date;
}
export interface ICommentBy {
  display_name: string;
  user_id: string;
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
  id: string;
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
