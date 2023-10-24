import joi from "joi";
import { Types } from "mongoose";
import { isValidObject } from "../../subcategories/controller/Subcategory.valid.schema.js";
const validByID = (value, helper) => {
  return Types.ObjectId.isValid(value)
    ? true
    : helper.message("Invalid ObjectId");
};
export const Vaild_CreateB = {
  body: joi
    .object({
      name: joi.string().required(),
    })
    .required(),
  query: joi
    .object({
      subCategoryID: joi.custom(validByID).required(),
      categoryID: joi.custom(validByID).required(),
    })
    .required(),
};

export const Vaild_updateB = {
  body: joi
    .object({
      name: joi.string(),
    })
    .required(),
  query: joi
    .object({
      subCategoryID: joi.custom(validByID).required(),
      categoryID: joi.custom(validByID).required(),
      brandid: joi.custom(validByID).required(),
    })
    .required(),
};

export const Vaild_deleteB = {
  query: joi
    .object({
      brandId: joi.custom(isValidObject).required(),
    })
    .required(),
};
