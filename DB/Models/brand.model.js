import { Schema, Types, model } from "mongoose";

const brandSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      lowecase: true,
    },
    slug: {
      type: String,
    },
    customId: {
      type: String,
      unique: true,
    },
    createdBy: {
      type: Types.ObjectId,
      required: true,
      ref: "user",
    },
    logo: {
      public_id: {
        required: true,
        type: String,
      },
      secure_url: {
        required: true,
        type: String,
      },
    },
    categoryId: {
      type: Types.ObjectId,
      required: true,
      ref: "category",
    },
    subCategoryId: {
      type: Types.ObjectId,
      required: true,
      ref: "subcategory",
    },
  },
  { timestamps: true }
);

const brandModel = model("brand", brandSchema);

export default brandModel;
