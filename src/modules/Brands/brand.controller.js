import slugify from 'slugify'
import { categoryModel } from '../../../DB/Models/category.model.js'
import { subCategoryModel } from '../../../DB/Models/subCategory.model.js'
import cloudinary from '../../utils/coludinaryConfigrations.js'
import { customAlphabet } from 'nanoid'
import { brandModel } from '../../../DB/Models/brand.model.js'
const nanoid = customAlphabet('123456_=!ascbhdtel', 5)

//=================================== Add Brand ========================
export const addBrand = async (req, res, next) => {
  const { name } = req.body
  const { subCategoryId, categoryId } = req.query
  // check categories
  const subCategoryExists = await subCategoryModel.findById(subCategoryId)
  const categoryExists = await categoryModel.findById(categoryId)

  if (!subCategoryExists || !categoryExists) {
    return next(new Error('invalid categories', { cause: 400 }))
  }
  // slug
  const slug = slugify(name, {
    replacement: '_',
    lower: true,
  })
  //logo
  if (!req.file) {
    return next(new Error('please upload your logo', { cause: 400 }))
  }
  const customId = nanoid()
  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.file.path,
    {
      folder: `${process.env.PROJECT_FOLDER}/Categories/${categoryExists.customId}/subCategories/${subCategoryExists.customId}/Brands/${customId}`,
    },
  )
  // db
  const brandObject = {
    name,
    slug,
    logo: { secure_url, public_id },
    categoryId,
    subCategoryId,
    customId,
  }
  const dbBrand = await brandModel.create(brandObject)
  if (!dbBrand) {
    await cloudinary.uploader.destroy(public_id)
    return next(new Error('try again later', { cause: 400 }))
  }
  res.status(201).json({ message: 'CreatedDone', dbBrand })
}

// TODO: update and delete brand , get all brands with products
