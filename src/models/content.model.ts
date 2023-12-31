import mongoose, { Schema } from "mongoose";
import { IContent } from "../Interfaces/content.interface";

export const contentSchema: Schema = new Schema({
  menu_name: { type: String, required: true, unique: true },
  description: { type: String },
  menu_image_url: { type: String },
  calories: { value: { type: String }, unit: { type: String } },
  process: {
    type: String,
    enum: ["ต้ม", "ผัด", "ทอด", "อบ", "นึ่ง", "ยำ", "ย่าง"],
    required: true,
  },
  nationality: {
    type: String,
    enum: ["ไทย", "จีน", "เกาหลี", "อิตาเลี่ยน", "ญี่ปุ่น"],
    required: true,
  }, // use the correct enum values
  healthy_concern: {
    type: [String],
    enum: ["เบาหวาน", "ความดัน", "หัวใจ", "ไต", "ลดน้ำหนัก", "อ้วน"],
    required: true,
  }, // use the correct enum values
  material: [
    {
      name: { type: String },
      quantity: { type: Number },
      unit: { type: String },
    },
  ],
  cooking_step: [
    {
      order: { type: Number },
      description: { type: String },
    },
  ],
  updated_at: { type: Date, default: Date.now },
  // comment: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
  comment: [
    {
      id: { type: mongoose.Schema.Types.ObjectId, ref: "comment" },
      description: { type: String, ref: "comment" },
      rating: { type: Number, ref: "comment" },
      comment_by: {
        display_name: { type: String, ref: "user" },
        user_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "user",
        },
        commentedAt: { type: Date, default: Date.now },
      },
    },
  ],
  average_rating: { type: Number, default: 0 },
  rating_count: { type: Number, default: 0 },
});

export const contentModel = mongoose.model<IContent>("content", contentSchema);
