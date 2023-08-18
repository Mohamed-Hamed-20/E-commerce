import { Router } from 'express'
import { multerCloudFunction } from '../../services/multerCloud.js'
import { allowedExtensions } from '../../utils/allowedExtensions.js'
import { asyncHandler } from '../../utils/errorhandling.js'
import * as cc from './category.contoller.js'
import { validationCoreFunction } from '../../middlewares/validation.js'
import * as validators from './category.validationSchemas.js'
import subCategoryRouter from '../subCategories/subCategory.routes.js'

const router = Router()

router.use('/:categoryId', subCategoryRouter)

router.post(
  '/',
  multerCloudFunction(allowedExtensions.Image).single('image'),
  validationCoreFunction(validators.createCategorySchema),
  asyncHandler(cc.createCategory),
)

router.put(
  '/:categoryId',
  multerCloudFunction(allowedExtensions.Image).single('image'),
  validationCoreFunction(validators.updateCategorySchema),
  asyncHandler(cc.updateCategory),
)

router.get('/', asyncHandler(cc.getAllCategories))

router.delete('/', asyncHandler(cc.deleteCategory)) // TODO: api validation

export default router
