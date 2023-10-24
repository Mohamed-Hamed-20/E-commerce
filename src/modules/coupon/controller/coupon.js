import couponModel from "../../../../DB/models/coupon.model.js";
import { usermodel } from "../../../../DB/models/user.model.js";
import { asyncHandler } from "../../../utils/errorHandling.js";

export const createCoupon = asyncHandler(async (req, res, next) => {
  const {
    couponCode,
    couponAmount,
    fromDate,
    toDate,
    isPercentage,
    isFixedAmount,
    couponAssginedToUsers,
  } = req.body;
  if (isFixedAmount == isPercentage) {
    return next(new Error("please select one of them"), {
      cause: 400,
    });
  }
  const chkcoupon = await couponModel.findOne({ couponCode });
  if (chkcoupon) {
    return next(new Error("couponCode name is already exist"), { cause: 400 });
  }
  if (isPercentage) {
    if (couponAmount < 1 || couponAmount > 100) {
      return next(new Error("invalid couponAmount"), { cause: 400 });
    }
  }
  couponAssginedToUsers.forEach(async (ele) => {
    const user = await usermodel.findById(ele.userId);
    if (!user) {
      return next(new Error("invalid userId"), { cause: 400 });
    }
  });
  const couponobject = {
    couponCode,
    couponAmount,
    fromDate,
    toDate,
    isPercentage,
    isFixedAmount,
    couponAssginedToUsers,
    createdBy: req.user._id,
  };
  const coupon = await couponModel.create(couponobject);
  return res.status(201).json({ message: "done", result: coupon });
});
export const getCoupons = asyncHandler(async (req, res, next) => {
  const coupons = await couponModel.find();
  return res.status(200).json({ message: "done", result: coupons });
});
