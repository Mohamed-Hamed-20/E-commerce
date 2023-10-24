import { Schema, Types, model } from "mongoose";

const couponschema = new Schema(
  {
    couponCode: {
      type: String,
      required: true,
      unique: true,
    },
    couponAmount: {
      type: Number,
      required: true,
    },
    isPercentage: {
      type: Boolean,
      default: false,
    },
    isFixedAmount: {
      type: Boolean,
      default: false,
    },
    fromDate: {
      type: String,
      required: true,
    },
    toDate: {
      type: String,
      required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    deletedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    couponStatus: {
      type: String,
      default: "Valid",
      enum: ["Valid", "Expired"],
    },
    couponAssginedToUsers: [
      {
        userId: {
          type: Types.ObjectId,
          required: true,
        },
        maxUsage: {
          type: Number,
          required: true,
        },
        usageCount: {
          type: Number,
          required: false,
          default: 0,
        },
      },
    ],
  },
  { timestamps: true }
);

const couponModel = model("coupon", couponschema);
export default couponModel;
