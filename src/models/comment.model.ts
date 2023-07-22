import mongoose, { Model, Schema } from "mongoose";
import { IComment } from "../Interfaces/content.interface";

export const CommentSchema = new Schema({
  description: { type: String },
  rating: { type: Number },
  comment_by: {
    display_name: { type: String },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    commentedAt: { type: Date, default: Date.now },

    text: { type: String, required: true },
  },
});

export const Comment: Model<IComment> = mongoose.model<IComment>(
  "Comment",
  CommentSchema
);
