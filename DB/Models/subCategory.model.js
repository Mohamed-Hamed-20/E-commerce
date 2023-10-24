import { Schema, Types, model } from "mongoose";

const SubCategorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      lowecase: true,
    },
    slug: {
      type: String,
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
    categoryId: {
      type: Types.ObjectId,
      required: true,
      ref: "category",
    },
    customId: {
      type: String, 
      required: true,
      unique: true,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);
SubCategorySchema.virtual("brand", {
  ref: "brand",
  foreignField: "subCategoryID",
  localField: "_id",
});
const SubCategoryModel = model("subcategory", SubCategorySchema);

export default SubCategoryModel;
