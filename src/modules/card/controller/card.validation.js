import Joi from "joi";
import { Types } from "mongoose";
const validationId = (value, helper) => {
  if (!Types.ObjectId.isValid(value)) {
    return helper.message("invalid object ID");
  } else {
    return true;
  }
};
export const addToCart = {
  body: Joi.object({
    productId: Joi.custom(validationId).required(),
    quantity: Joi.number().min(1).max(50).required(),
  }).required(),
};
export const deleteFromCart = {
  body: Joi.object({
    productId: Joi.custom(validationId).required(),
  }).required(),
};
