import { Schema, Types, model } from "mongoose";

const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    slug: {
      type: String,
      lowercase: true,
    },
    createdBy: {
      type: Types.ObjectId,
      required: true,
      ref: "user",
    },
    Images: {
      public_id: {
        required: true,
        type: String,
      },
      secure_url: {
        required: true,
        type: String,
      },
    },
    customId: {
      type: String,
      unique: true,
    },
    updatedBy: {
      type: Types.ObjectId,
      ref: "user",
    },
  },
  { timestamps: true }
);

const categoryModel = model("category", categorySchema);

export default categoryModel;
