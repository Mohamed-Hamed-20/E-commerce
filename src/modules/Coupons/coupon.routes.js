import { Router } from 'express'
const router = Router()
import * as cc from './coupon.controller.js'
import { asyncHandler } from '../../utils/errorhandling.js'
import { multerCloudFunction } from '../../services/multerCloud.js'
import { allowedExtensions } from '../../utils/allowedExtensions.js'
import { validationCoreFunction } from '../../middlewares/validation.js'
import { addCouponSchema } from './coupon.validationSchemas.js'

router.post(
  '/',
  validationCoreFunction(addCouponSchema),
  asyncHandler(cc.addCoupon),
)
export default router
