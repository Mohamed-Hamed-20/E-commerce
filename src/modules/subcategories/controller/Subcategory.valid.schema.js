import joi from "joi";
import { Types } from "mongoose";

export const isValidObject = (value, helper) => {
  return Types.ObjectId.isValid(value)
    ? true
    : helper.message("Invalid ObjectId!");
};

export const CreateSubCategory = {
  body: joi
    .object({
      name: joi.string().min(3),
    })
    .required(),
  query: joi
    .object({
      categoryId: joi.custom(isValidObject).required(),
    })
    .required(),
};
export const Update_SubCategory = {
  query: joi
    .object({
      categoryid: joi.custom(isValidObject).required(),
      subcategoryid: joi.custom(isValidObject).required(),
    })
    .required(),
  body: joi
    .object({
      name: joi.string(),
    })
    .required(),
};

export const delete_SubCategory = {
  query: joi
    .object({
      subcategoryid: joi.custom(isValidObject).required(),
      categoryid: joi.custom(isValidObject).required(),
    })
    .required(),
};
