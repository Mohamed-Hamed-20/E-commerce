import { Schema, Types, model } from "mongoose";

const productSchema = new Schema(
  {
    title: {
      type: String,
      lowecase: true,
      required: true,
    },
    slug: {
      type: String,
      lowecase: true,
      required: true,
    },
    desc: {
      type: String,
    },
    customId: {
      type: String,
      required: true,
      unique: true,
    },
    color: [{
      type: String,
      required: true,
    }],
    size: [{
      type: String,
      required: true,
    }],
    price: {
      type: Number,
      required: true,
      default: 1,
    },
    appliedDiscount: {
      type: Number,
      default: 0,
    },
    priceAfterDiscount: {
      type: Number,
      default: 0,
    },
    stock: {
      type: Number,
      required: true,
      default: 1,
    },
    createdBy: {
      type: Types.ObjectId,
      required: true,
      ref: "user",
    },
    updateBy: {
      type: Types.ObjectId,
      ref: "user",
    },
    deleteBy: {
      type: Types.ObjectId,
      ref: "user",
    },
    Imges: [
      {
        public_id: {
          required: true,
          type: String,
        },
        secure_url: {
          required: true,
          type: String,
        },
      },
    ],
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
    brandId: {
      type: Types.ObjectId,
      required: true,
      ref: "brand",
    },
  },
  { timestamps: true }
);

const productModel = model("product", productSchema);

export default productModel;
