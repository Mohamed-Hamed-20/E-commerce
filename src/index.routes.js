import connectDB from "../DB/connect.js";
import cors from "cors";
import userRouter from "./modules/user/user.routes.js";
import categoryRouter from "./modules/category/category.routes.js";
import SubCategoryRouter from "./modules/subcategories/subcategory.routes.js";
import BrandRouter from "./modules/brand/brand.routes.js";
import ProductRouter from "./modules/product/product.routes.js";
import CardRouter from "./modules/card/card.routes.js";
import CouponRouter from "./modules/coupon/coupon.routes.js";
import orderRouter from "./modules/order/order.routes.js";
import { GlobalErrorHandling } from "./utils/errorHandling.js";

export const bootstrap = (app, express) => {
  connectDB();

  // app.use(bodyParser.urlencoded({ extended: true }));
  // const allowlist = ["htttp://127.0.0.1:3000", "htttp://127.0.0.1:7000"];
  // app.use((req, res, next) => {
  //   console.log(req.headers("orgin"));
  //   if (req.orginalUrl.includes("/user/confirmEmail")) {
  //     res.setHeader("Access-Control-Allow-Origin", "*");
  //     res.setHeader("Access-Control-Allow-Headers", "GET");
  //     return next();
  //   }
  //   if (allowlist.includes(req.headers("orgin"))) {
  //     return next(new Error("blocked by cros"));
  //   } else {
  //     res.setHeader("Access-Control-Allow-Origin", "*"); // قم بتعديل الأصل إلى الذي تستخدمه في الجزء الأمامي
  //     res.setHeader("Access-Control-Allow-Headers", "*");
  //     res.setHeader("Access-Control-Allow-Methods", "*");
  //     res.setHeader("Access-Control-Allow-Private-Network", true);
  //     return next();
  //   }
  // });

  app.use(cors());
  //Allow feaching Data
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // API
  app.use("/user", userRouter);
  app.use("/category", categoryRouter);
  app.use("/SubCategory", SubCategoryRouter);
  app.use("/coupon", CouponRouter);
  app.use("/brand", BrandRouter);
  app.use("/product", ProductRouter);
  app.use("/card", CardRouter);
  app.use("/order", orderRouter);

  //Globale error handling
  app.use(GlobalErrorHandling);

  //API bad
  app.all("*", (req, res) => res.send("invalid router link or method!"));
  const port = parseInt(process.env.port) || 8000;
  app.listen(port, () => console.log(`Example app listening on port ${port}!`));
};
