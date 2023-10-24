import { Router } from "express";
import * as pc from "./controller/product.js";
import { authentication } from "../../middleware/authentication.js";
import { authorization } from "../../middleware/authorization.js";
import { multerCloudFunction } from "../../utils/multerCloud.js";
import { allowedExtensions } from "../../utils/allowedExtensions.js";
import { valid } from "../../middleware/validation.js";
import * as validschema from "./controller/product.vaild.schema.js";
const router = Router({ mergeParams: true });

router.post(
  "/createProduct",
  authentication,
  authorization("admin"),
  multerCloudFunction(allowedExtensions.Image).array("image", 3),
  valid(validschema.createProductSchema),
  pc.createProduct
);

router.put(
  "/updateProduct",
  authentication,
  authorization("admin"),
  multerCloudFunction(allowedExtensions.Image).array("image", 3),
  valid(validschema.updateProductSchema),
  pc.updateProduct
);

router.get(
  "/getProduct",
  // authentication,
  // authorization("admin"),
  pc.getProduct
);
router.get("/searchByCategoryId", pc.searchByCategoryId);
export default router;
