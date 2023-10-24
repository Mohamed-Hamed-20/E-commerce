import { Schema, Types, model } from "mongoose";

const cardSchema = new Schema(
  {
    userId: {
      type: Types.ObjectId,
      required: true,
      ref: "user",
    },
    products: [
      {
        productId: {
          type: Types.ObjectId,
          required: true,
          ref: "product",
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],
    subTotal: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const cardModel = model("card", cardSchema);
export default cardModel;
