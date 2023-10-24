import joi from "joi";
import { Types } from "mongoose";

// import { validate } from "joi";
const req_FE = ["body", "params", "query", "file", "files", "headers"];
export const valid = (schema) => {
  return (req, res, next) => {
    const Validation_error = [];
    req_FE.forEach((key) => {
      if (schema[key]) {
        const validationResult = schema[key].validate(req[key], {
          abortEarly: false,
        });
        if (validationResult.error) {
          Validation_error.push(validationResult.error.details);
        }
      }
      if (Validation_error.length > 0) {
        return res
          .status(400)
          .json({ message: "validation error", Validation_error });
      }
    });
    return next();
  };
};

//============================= validatioObjectId =====================
const validateObjectId = (value, helper) => {
  return Types.ObjectId.isValid(value) ? true : helper.message("invalid id");
};
export const generalFields = {
  email: joi
    .string()
    .email({ tlds: { allow: ["com", "net", "org"] } })
    .required(),
  password: joi
    .string()
    .regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)
    .messages({
      "string.pattern.base": "Password regex fail",
    })
    .required(),
  _id: joi.string().custom(validateObjectId),
  file: joi.object({
    size: joi.number(),
  }),
};
