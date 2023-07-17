import mongoose, { Schema } from "mongoose";
import { IContent } from "../Interfaces/content.interface";

const contentSchema: Schema = new Schema({
  menu_name: { type: String, required: true, unique: true },
  description: { type: String },
  menu_image_url: { type: String, required: true },
  calories: { value: { type: String }, unit: { type: String } },
  process: {
    type: [String],
    enum: ["ต้ม", "ผัด", "ทอด", "อบ", "นึ่ง", "ยำ", "ย่าง"],
    required: true,
  },
  nationality: {
    type: String,
    enum: ["ไทย", "จีน", "เกาหลี", "อิตาเลี่ยน", "ญี่ปุ่น"],
    required: true,
  }, // use the correct enum values
  healthy_concern: {
    type: String,
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
  comment: [
    {
      description: { type: String },
      commentBy: {
        name: { type: String },
        commentedAt: { type: Date, default: Date.now },
      },
    },
  ],
  rating: [
    {
      value: { type: Number },
      user: {
        id: { type: Object }, // use the correct reference
      },
    },
  ],
});

export const contentModel = mongoose.model<IContent>("content", contentSchema);
