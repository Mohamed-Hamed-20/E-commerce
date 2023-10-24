import { Schema, Types, model } from "mongoose";

const orderSchema = new Schema(
  {
    userId: {
      type: Types.ObjectId,
      required: true,
    },
    products: [
      {
        productId: {
          type: Types.ObjectId,
          required: true,
          ref: "product",
        },
        quantity: {
          type: String,
          required: true,
          default: 1,
        },
        title: {
          type: String,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
        finalPrice: {
          type: Number,
          required: true,
        },
      },
    ],
    subTotal: {
      type: Number,
      required: true,
    },
    couponId: {
      type: Types.ObjectId,
      ref: "coupon",
      required: true,
    },
    paidAmount: {
      type: Number,
      required: true,
      default: 0,
    },
    address: {
      type: String,
      required: true,
    },
    phoneNumbers: [
      {
        type: String,
        required: true,
      },
    ],
    orderStatus: {
      type: String,
      enum: [
        "placed",
        "delivered",
        "canceled",
        "rejected",
        "pending",
        "confirmed",
        "on way",
      ],
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ["cash", "card"],
      required: true,
    },
    cancelledBy: { type: Schema.Types.ObjectId, ref: "User" },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
    reason: String,
  },
  { timestamps: true }
);

const orderModel = model("order", orderSchema);

export default orderModel;
