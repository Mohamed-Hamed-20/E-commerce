import mongoose, { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    firstName: { type: String },
    lastName: { type: String },
    userName: {
      type: String,
      required: true,
      unique: true,
      min: 3,
      max: 22,
      lowercase: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    address: [
      {
        type: String,
        required: true,
      },
    ],
    phone: { type: String },
    // dateOfBirth: { type: Date },

    profilePIC: {
      public_id: {
        type: String,
        default: "depositphotos_29387653-stock-photo-facebook-profile_npymre",
      },
      secure_url: {
        type: String,
        default:
          "https://res.cloudinary.com/dxjng5bfy/image/upload/v1692289127/Ecommerce/depositphotos_29387653-stock-photo-facebook-profile_npymre.jpg",
      },
    },

    coverImges: [
      {
        public_id: { type: String, required: true },
        secure_url: { type: String, required: true },
      },
    ],
    gender: {
      type: String,
      lowercase: true,
      enum: ["male", "female"],
      default: "male",
    },
    status: {
      type: String,
      default: "offline",
      enum: ["online", "offline"],
    },
    role: {
      type: String,
      enum: ["user", "admin", "superadmin"],
      default: "user",
    },
    isconfrimed: {
      type: Boolean,
      default: false,
    },
    forgetCode: {
      type: String,
    },
    activationCode: {
      type: String,
    },
  },
  { timestamps: true }
);

export const usermodel = mongoose.models.usermodel || model("user", userSchema);
