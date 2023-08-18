import Joi from 'joi'
import { generalFields } from '../../middlewares/validation.js'

export const addProductSchema = {
  body: Joi.object({
    title: Joi.string().min(5).max(55).required(),
    desc: Joi.string().min(5).max(255).optional(),
    price: Joi.number().positive().min(1).required(),
    appliedDiscount: Joi.number().positive().min(1).max(100).optional(),
    colors: Joi.array().items(Joi.string().required()).optional(),
    sizes: Joi.array().items(Joi.string().required()).optional(),
    stock: Joi.number().integer().positive().min(1).required(),
  }),
  // ids
  query: Joi.object({
    categoryId: generalFields._id,
    subCategoryId: generalFields._id,
    brandId: generalFields._id
  })
    .required()
    .options({ presence: 'required' }),
}

export const updateProductSchema = {
  body: Joi.object({
    title: Joi.string().min(5).max(55).optional(),
    desc: Joi.string().min(5).max(255).optional(),
    price: Joi.number().positive().min(1).optional(),
    appliedDiscount: Joi.number().positive().min(1).max(100).optional(),
    colors: Joi.array().items(Joi.string().required()).optional(),
    sizes: Joi.array().items(Joi.string().required()).optional(),
    stock: Joi.number().integer().positive().min(1).optional(),
  }),
  // Ids
}
