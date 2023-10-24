import { Router } from "express";
import * as cc from "./controller/category.js";
import { multerCloudFunction } from "../../utils/multerCloud.js";
import { allowedExtensions } from "../../utils/allowedExtensions.js";
import { valid } from "../../middleware/validation.js";
import * as schemaV from "./controller/category.validation.js";
import { authentication } from "../../middleware/authentication.js";
import productRouter from "../product/product.routes.js";
import { authorization } from "../../middleware/authorization.js";
const router = Router();
router.use("/:categoryId/products", productRouter);
router.post(
  "/createCategory",
  authentication,
  authorization(["SuperAdmin", "admin"]),
  multerCloudFunction(allowedExtensions.Image).single("imgcategory"),
  valid(schemaV.createSchemaCategory),
  cc.createCategory
);

router.put(
  "/UpdateCategory",
  authentication,
  authorization(["admin","superAdmin"]),
  multerCloudFunction(allowedExtensions.Image).single("imgcategory"),
  valid(schemaV.UpdateSchemaCategory),
  cc.UpdateCategory
);

router.delete(
  "/deleteCategory",
  authentication,
  authorization(["admin", "superAdmin"]),
  valid(schemaV.deleteSchemaCategory),
  cc.deleteCategory
);
router.get("/Get_all_Category_with_SubC", cc.Get_all_Category_with_SubC);
router.get("/searchCategory", cc.searchCategory);

export default router;
