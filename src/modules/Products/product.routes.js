import { Router } from 'express'
const router = Router()
import * as pc from './product.controller.js'
import { asyncHandler } from '../../utils/errorhandling.js'
import { multerCloudFunction } from '../../services/multerCloud.js'
import { allowedExtensions } from '../../utils/allowedExtensions.js'
import * as validators from './product.validationSchemas.js'
import { validationCoreFunction } from '../../middlewares/validation.js'

router.post(
  '/',
  multerCloudFunction(allowedExtensions.Image).array('image', 3),
  validationCoreFunction(validators.addProductSchema),
  asyncHandler(pc.addProduct),
)

router.put(
  '/',
  multerCloudFunction(allowedExtensions.Image).array('image', 2),
  validationCoreFunction(validators.updateProductSchema),
  asyncHandler(pc.updateProduct),
)

router.get('/', asyncHandler(pc.getAllProd))
router.get('/title', asyncHandler(pc.getProductsByTitle))
router.get('/listProducts', asyncHandler(pc.listProducts))
router.delete('/', asyncHandler(pc.deleteProduct))

export default router
