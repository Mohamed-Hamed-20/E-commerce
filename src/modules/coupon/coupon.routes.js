import { Router } from "express";
import * as co_c from "./controller/coupon.js";
import { valid } from "../../middleware/validation.js";
import { createCouponSchema } from "./controller/coupon.valid.js";
import { authentication } from "../../middleware/authentication.js";
import { authorization } from "../../middleware/authorization.js";
const router = Router();
router.use(authentication, authorization("admin"));
router.post("/createCoupon", valid(createCouponSchema), co_c.createCoupon);
router.get("/getallcopuons", co_c.getCoupons);

export default router;
