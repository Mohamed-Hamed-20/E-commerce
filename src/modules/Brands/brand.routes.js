import { Router } from 'express'
const router = Router()
import * as bc from './brand.controller.js'
import { asyncHandler } from '../../utils/errorhandling.js'
import { multerCloudFunction } from '../../services/multerCloud.js'
import { allowedExtensions } from '../../utils/allowedExtensions.js'

// TODO: api validation
router.post(
  '/',
  multerCloudFunction(allowedExtensions.Image).single('logo'),
  asyncHandler(bc.addBrand),
)
export default router
