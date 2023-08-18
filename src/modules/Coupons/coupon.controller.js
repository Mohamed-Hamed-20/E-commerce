import { couponModel } from '../../../DB/Models/coupon.model.js'

export const addCoupon = async (req, res, next) => {
  const {
    couponCode,
    couponAmount,
    fromDate,
    toDate,
    isPercentage,
    isFixedAmount,
  } = req.body

  // check coupon code if it's duplicate
  const isCouponCodeDuplicate = await couponModel.findOne({ couponCode })
  if (isCouponCodeDuplicate) {
    return next(new Error('duplicate couponCode', { cause: 400 }))
  }
  if ((!isFixedAmount && !isPercentage) || (isFixedAmount && isPercentage)) {
    return next(
      new Error('select if the coupon is percentage or fixedAmount', {
        cause: 400,
      }),
    )
  }

  const couponObject = {
    couponCode,
    couponAmount,
    fromDate,
    toDate,
    isPercentage,
    isFixedAmount,
  }

  const couponDb = await couponModel.create(couponObject)
  if (!couponDb) {
    return next(new Error('fail to add coupon', { cause: 400 }))
  }
  res.status(201).json({ message: 'Done', couponDb })
}
