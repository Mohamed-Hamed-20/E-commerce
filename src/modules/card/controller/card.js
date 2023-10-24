import cardModel from "../../../../DB/models/card.model.js";
import productModel from "../../../../DB/models/product.model.js";
import { asyncHandler } from "../../../utils/errorHandling.js";

export const addToCart = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;
  const { productId, quantity } = req.body;
  //   console.log({ productId, quantity });
  const ChkProduct = await productModel.findOne({
    _id: productId,
    stock: { $gte: quantity },
  });
  if (!ChkProduct) {
    return next(
      new Error("invalid product Id or quantity is not available ", {
        cause: 400,
      })
    );
  }
  let subTotal = 0;
  const card = await cardModel.findOne({ userId: userId });
  if (!card) {
    const cardObject = {
      userId: userId,
      products: [{ productId: productId, quantity: quantity }],
      subTotal: (subTotal += ChkProduct.priceAfterDiscount * quantity),
    };
    // console.log(cardObject.subTotal);
    const save_Card = await cardModel.create(cardObject);
    return res.status(200).json({ message: "done", result: save_Card });
  }
  if (card) {
    let updated = false;
    for (const product of card.products) {
      if (productId == product.productId.toString()) {
        product.quantity = quantity;
        updated = true;
      }
    }
    if (!updated) {
      card.products.push({ productId, quantity });
    }
    //==================== calculate Subtotal ===============
    for (const product of card.products) {
      const price_product = await productModel.findById({
        _id: product.productId,
      });
      subTotal += price_product.priceAfterDiscount * product.quantity;
    }
    card.subTotal = subTotal;
    await card.save();
    return res.status(200).json({ message: "done", result: card });
  }
});

export const deleteFromCart = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;
  const { productId } = req.body;
  // console.log({ userId, productId });
  //chk product
  const product = await productModel.findById({ _id: productId });
  //if not found
  if (!product) {
    return next(new Error("invalid product Id", { cause: 400 }));
  }
  //find card to user
  const card = await cardModel.findOne({
    userId: userId,
    "products.productId": productId,
  });
  if (!card) {
    return next(
      new Error("Card Not found or product not in card", { cause: 400 })
    );
  }
  // edit subTotal
  let subTotal = card.subTotal;
  for (const product of card.products) {
    if (product.productId.toString() == productId) {
      const getProduct = await productModel.findById(product.productId);
      // console.log({ priceAfterDiscount: getProduct.priceAfterDiscount });
      // console.log({ subTotal_in_card: card.subTotal });
      subTotal -= getProduct.priceAfterDiscount * product.quantity;
      // console.log({ subTotal: subTotal });
    }
  }
  card.subTotal = subTotal;
  card.products = card.products.filter((element) => {
    if (element.productId == productId) {
      return false;
    }
    return true;
  });
  card.save();
  return res.status(200).json({ message: "done", success: true, result: card });
});

export const ________ = asyncHandler(async (req, res, next) => {});
