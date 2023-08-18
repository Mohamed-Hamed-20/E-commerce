import joi from 'joi'


export const createSubCategorySchema = {
  body: joi
    .object({
      name: joi.string().min(4).max(55),
    })
    .required()
    .options({ presence: 'required' }),
}
