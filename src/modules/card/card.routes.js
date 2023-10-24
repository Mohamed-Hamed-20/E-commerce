import { Router } from "express";
import * as CardControl from "./controller/card.js";
import { authentication } from "../../middleware/authentication.js";
import { authorization } from "../../middleware/authorization.js";
import { valid } from "../../middleware/validation.js";
import * as schema from "./controller/card.validation.js";
const router = Router();

router.post(
  "/addToCart",
  authentication,
  authorization(["user", "admin"]),
  valid(schema.addToCart),
  CardControl.addToCart
);
router.post(
  "/deleteFromCart",
  authentication,
  authorization(["user", "admin"]),
  valid(schema.deleteFromCart),
  CardControl.deleteFromCart
);
export default router;
