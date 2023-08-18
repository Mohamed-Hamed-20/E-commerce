import slugify from 'slugify'
import { brandModel } from '../../../DB/Models/brand.model.js'
import { categoryModel } from '../../../DB/Models/category.model.js'
import { subCategoryModel } from '../../../DB/Models/subCategory.model.js'
import cloudinary from '../../utils/coludinaryConfigrations.js'

import { customAlphabet } from 'nanoid'
const nanoid = customAlphabet('123456_=!ascbhdtel', 5)
import { productModel } from '../../../DB/Models/product.model.js'
import { paginationFuction } from '../../utils/pagination.js'
import { ApiFeatures } from '../../utils/apiFeatures.js'

//============================= Add product ===================
export const addProduct = async (req, res, next) => {
  const { title, desc, price, appliedDiscount, colors, sizes, stock } = req.body

  const { categoryId, subCategoryId, brandId } = req.query
  // check Ids
  const subCategoryExists = await subCategoryModel.findById(subCategoryId)
  if (!subCategoryExists) {
    return next(new Error('invalid subcategoryId', { cause: 400 }))
  }
  const categoryExists = await categoryModel.findById(categoryId)
  if (!categoryExists) {
    return next(new Error('invalid categoryID', { cause: 400 }))
  }
  const brandExists = await brandModel.findById(brandId)
  if (!brandExists) {
    return next(new Error('invalid brandId', { cause: 400 }))
  }

  const slug = slugify(title, {
    replacement: '_',
  })
  const priceAfterDiscount = price * (1 - (appliedDiscount || 0) / 100)

  if (!req.files) {
    return next(new Error('please upload pictures', { cause: 400 }))
  }
  const customId = nanoid()

  const Images = []
  const publicIds = []
  for (const file of req.files) {
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      file.path,
      {
        folder: `${process.env.PROJECT_FOLDER}/Categories/${categoryExists.customId}/subCategories/${subCategoryExists.customId}/Brands/${brandExists.customId}/Products/${customId}`,
      },
    )
    Images.push({ secure_url, public_id })
    publicIds.push(public_id)
  }

  req.imagePath = `${process.env.PROJECT_FOLDER}/Categories/${categoryExists.customId}/subCategories/${subCategoryExists.customId}/Brands/${brandExists.customId}/Products/${customId}`

  const productObject = {
    title,
    slug,
    desc,
    price,
    appliedDiscount,
    priceAfterDiscount,
    colors,
    sizes,
    stock,
    categoryId,
    subCategoryId,
    brandId,
    Images,
    customId,
  }
  // productObject = 5

  const product = await productModel.create(productObject)

  if (!product) {
    await cloudinary.api.delete_resources(publicIds)
    return next(new Error('trye again later', { cause: 400 }))
  }
  res.status(200).json({ message: 'Done', product })
}

//================================= update product ===========================
export const updateProduct = async (req, res, next) => {
  const { title, desc, price, appliedDiscount, colors, sizes, stock } = req.body

  const { productId, categoryId, subCategoryId, brandId } = req.query

  // check productId
  const product = await productModel.findById(productId)
  if (!product) {
    return next(new Error('invalid product id', { cause: 400 }))
  }

  const subCategoryExists = await subCategoryModel.findById(
    subCategoryId || product.subCategoryId,
  )
  if (subCategoryId) {
    if (!subCategoryExists) {
      return next(new Error('invalid subcategories', { cause: 400 }))
    }
    product.subCategoryId = subCategoryId
  }
  const categoryExists = await categoryModel.findById(
    categoryId || product.categoryId,
  )
  if (categoryId) {
    if (!categoryExists) {
      return next(new Error('invalid categories', { cause: 400 }))
    }
    product.categoryId = categoryId
  }

  const brandExists = await brandModel.findById(brandId || product.brandId)
  if (brandId) {
    if (!brandExists) {
      return next(new Error('invalid brand', { cause: 400 }))
    }
    product.brandId = brandId
  }

  if (appliedDiscount && price) {
    const priceAfterDiscount = price * (1 - (appliedDiscount || 0) / 100)
    product.priceAfterDiscount = priceAfterDiscount
    product.price = price
    product.appliedDiscount = appliedDiscount
  } else if (price) {
    const priceAfterDiscount =
      price * (1 - (product.appliedDiscount || 0) / 100)
    product.priceAfterDiscount = priceAfterDiscount
    product.price = price
  } else if (appliedDiscount) {
    const priceAfterDiscount =
      product.price * (1 - (appliedDiscount || 0) / 100)
    product.priceAfterDiscount = priceAfterDiscount
    product.appliedDiscount = appliedDiscount
  }

  if (req.files?.length) {
    let ImageArr = []
    for (const file of req.files) {
      const { secure_url, public_id } = await cloudinary.uploader.upload(
        file.path,
        {
          folder: `${process.env.PROJECT_FOLDER}/Categories/${categoryExists.customId}/subCategories/${subCategoryExists.customId}/Brands/${brandExists.customId}/Products/${product.customId}`,
        },
      )
      ImageArr.push({ secure_url, public_id })
    }
    let public_ids = []
    for (const image of product.Images) {
      public_ids.push(image.public_id)
    }
    await cloudinary.api.delete_resources(public_ids)
    product.Images = ImageArr
  }

  if (title) {
    product.title = title
    product.slug = slugify(title, '-')
  }
  if (desc) product.desc = desc
  if (colors) product.colors = colors
  if (sizes) product.sizes = sizes
  if (stock) product.stock = stock

  await product.save()
  res.status(200).json({ message: 'Done', product })
}

//================================= delete product ===========================
export const deleteProduct = async (req, res, next) => {
  const { productId } = req.query
  // check productId
  const product = await productModel.findByIdAndDelete(productId)
  if (!product) {
    return next(new Error('invalid product id', { cause: 400 }))
  }
  res.status(200).json({ message: 'Done', product })
}

//==================================== get all products paginated ==================
export const getAllProd = async (req, res, next) => {
  const { page, size } = req.query
  const { limit, skip } = paginationFuction({ page, size })
  const products = await productModel.find().limit(limit).skip(skip)
  res.status(200).json({ message: 'Done', products })
}
//======================================= search by title ===================
export const getProductsByTitle = async (req, res, next) => {
  const { searchKey, page, size } = req.query

  const { limit, skip } = paginationFunction({ page, size })

  const productsc = await productModel
    .find({
      $or: [
        { title: { $regex: searchKey, $options: 'i' } },
        { desc: { $regex: searchKey, $options: 'i' } },
      ],
    })
    .limit(limit)
    .skip(skip)
  res.status(200).json({ message: 'Done', productsc })
}

// ========================== apply some features in api =====================
export const listProducts = async (req, res, next) => {
  // const { sort } = req.query
  // ==================== sort
  // '-price,stock' => '-price stock'
  // const products = await productModel
  //   .find()
  //   .sort(req.query.sort.replaceAll(',', ' '))

  // ===================== select ================
  // console.log(req.query.select.replaceAll(',', ' '))
  // const products = await productModel
  //   .find()
  //   .select(req.query.select.replaceAll(',', ' '))

  //====================== search ==============
  // const products = await productModel.find({
  //   $or: [
  //     { title: { $regex: req.query.search, $options: 'i' } },
  //     { desc: { $regex: req.query.search, $options: 'i' } },
  //   ],
  // })

  //===================== filters =================
  // const queryInstance = { ...req.query }
  // const execuldeKeysArr = ['page', 'size', 'sort', 'select', 'search']
  // execuldeKeysArr.forEach((key) => delete queryInstance[key])
  // const queryString = JSON.parse(
  //   JSON.stringify(queryInstance).replace(
  //     /gt|gte|lt|lte|in|nin|eq|neq|regex/g,
  //     (match) => `$${match}`,
  //   ),
  // )

  const ApiFeaturesInstance = new ApiFeatures(productModel.find({}), req.query)
    .pagination()
    .filters()
    .sort()
  const products = await ApiFeaturesInstance.mongooseQuery
  res.status(200).json({ message: 'Done', products })
}

// gt, gte , lt , lte , in , nin, eq ,neq , regex
