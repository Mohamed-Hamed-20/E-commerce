import joi from "joi";
import { Types } from "mongoose";

const validationId = (value, helper) => {
  if (!Types.ObjectId.isValid(value)) {
    return helper.message("invalid object ID");
  } else {
    return true;
  }
};
export const createProductSchema = {
  body: joi
    .object({
      title: joi.string().required(),
      desc: joi.string().optional(),
      price: joi.number().required(),
      color: joi.array().required(),
      size: joi.array().required(),
      appliedDiscount: joi.number().min(0).max(100).optional(),
      stock: joi.number().required(),
    })
    .required(),
  query: joi
    .object({
      categoryId: joi.custom(validationId).required(),
      subCategoryId: joi.custom(validationId).required(),
      brandId: joi.custom(validationId).required(),
    })
    .required(),
};

export const updateProductSchema = {
  body: joi.object({
    title: joi.string().optional(),
    desc: joi.string().optional(),
    price: joi.number().optional(),
    appliedDiscount: joi.number().min(0).max(100).optional(),
    color: joi.array().optional(),
    size: joi.array().optional(),
    stock: joi.number().optional(),
  }),
  query: joi
    .object({
      productId: joi.custom(validationId).required(),
      categoryId: joi.custom(validationId).optional(),
      subCategoryId: joi.custom(validationId).optional(),
      brandId: joi.custom(validationId).optional(),
    })
    .optional(),
};
