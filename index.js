import express from "express";
import { bootstrap } from "./src/index.routes.js";
const app = express();

//connect with config.env
import dotenv from "dotenv";
dotenv.config({ path: ".env" });
//application
if (process.env.MODE == "development") {
  app.use(morgan("dev"));
}
bootstrap(app, express);
