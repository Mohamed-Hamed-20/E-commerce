import mongoose, { model, Schema, Types } from "mongoose";

// import mongoose,{schema,model} from 'mongoose';
const tokenSchema = new Schema(
  {
    token: {
      type: String,
      required: true,
    },
    userID: {
      type: Types.ObjectId,
      ref: "user",
      required: true,
    },
    agent: {
      type: String,
    },
    isvalid: {
      type: Boolean,
      default: true,
    },
    expiredAt: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

export const tokenmodel =
  mongoose.models.tokenmodel || model("token", tokenSchema);
