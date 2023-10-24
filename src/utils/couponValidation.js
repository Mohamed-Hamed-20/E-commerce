import couponModel from "../../DB/models/coupon.model.js";

export const couponValidation = async (couponCode, userId) => {
  //1 copon in DB
  const coupon = await couponModel.findOne({ couponCode });
  if (!coupon) {
    return { msg: "invalid coupon Code" };
  }
  //2 copoun is valid
  if (coupon.couponStatus == "Expired") {
    return { msg: "couponCode Expired" };
  }
  //3 copoun not end time
  if (coupon.toDate < Date.now()) {
    return { msg: "couponCode end time" };
  }
  //4 coupon is allow to this user
  //5 copun is less than max use
  let isAssgined = false;
  let exceed = false;
  for (const user of coupon.couponAssginedToUsers) {
    if (user.userId.toString() == userId.toString()) {
      isAssgined = true;
      if (user.maxUsage <= user.usageCount) {
        exceed = true;
      }
    }
  }
  if (!isAssgined) {
    return { msg: "user not assign to use this coupon" };
  }
  if (exceed) {
    return { msg: "exceed the maxCount" };
  }

  return {
    code: 200,
    coupon: coupon,
  };
};
