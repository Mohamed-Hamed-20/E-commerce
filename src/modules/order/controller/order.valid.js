import Joi from "joi";
import { generalFields } from "../../../middleware/validation.js";

export const add_order = {
  body: Joi.object({
    quantity: Joi.number().required(),
    productId: generalFields._id.required(),
    couponCode: Joi.string().required(),
    address: Joi.string().required(),
    phoneNumbers: Joi.string().required(),
    paymentMethod: Joi.string().valid("card", "cash").required(),
  }).required(),
};
export const cardToOrder = {
  body: Joi.object({
    cartId: generalFields._id.required(),
    couponCode: Joi.string().required(),
    address: Joi.string().required(),
    phoneNumbers: Joi.string().required(),
    paymentMethod: Joi.string().valid("card", "cash").required(),
  }).required(),
};
