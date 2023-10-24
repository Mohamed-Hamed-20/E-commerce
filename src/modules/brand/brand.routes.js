import { Router } from "express";
import * as Bc from "./controller/brand.js";
import { multerCloudFunction } from "../../utils/multerCloud.js";
import { allowedExtensions } from "../../utils/allowedExtensions.js";
import { authentication } from "../../middleware/authentication.js";
import { authorization } from "../../middleware/authorization.js";
import { valid } from "../../middleware/validation.js";
import * as schema from "./controller/brand.valid.js";
const router = Router();

router.post(
  "/createBrand",
  authentication,
  authorization("admin"),
  multerCloudFunction(allowedExtensions.Image).single("logo"),
  valid(schema.Vaild_CreateB),
  Bc.createBrand
);
router.put(
  "/updateBrand",
  authentication,
  authorization("admin"),
  multerCloudFunction(allowedExtensions.Image).single("logo"),
  valid(schema.Vaild_updateB),
  Bc.updateBrand
);

router.delete(
  "/deleteBrand",
  authentication,
  authorization(["admin", "superAdmin"]),
  valid(schema.Vaild_deleteB),
  Bc.deleteBrand
);
router.get("/searchbrand", Bc.searchbrand);
export default router;
