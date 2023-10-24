import slugify from "slugify";
import brandModel from "../../../../DB/models/brand.model.js";
import categoryModel from "../../../../DB/models/category.model.js";
import SubCategoryModel from "../../../../DB/models/subcategory.model.js";
import { asyncHandler } from "../../../utils/errorHandling.js";
import productModel from "../../../../DB/models/product.model.js";
import cloudinary from "../../../utils/coludinaryConfigrations.js";
import { customAlphabet } from "nanoid";
import { pagenation } from "../../../utils/pagination.js";
import { ApiFeature } from "../../../utils/apiFeature.js";
const nanoid = customAlphabet("abcdefghigklmnopqwert1234567890", 7);

export const createProduct = asyncHandler(async (req, res, next) => {
  const { subCategoryId, categoryId, brandId } = req.query;
  //chk subcategoryId, categoryId, brandId not create efore in DB
  const category = await categoryModel.findById(categoryId);
  if (!category) {
    return next(new Error("Category not found", { cause: 404 }));
  }

  const subcategory = await SubCategoryModel.findById(subCategoryId);
  if (!subcategory) {
    return next(new Error("subcategory not found", { cause: 404 }));
  }

  const brand = await brandModel.findById(brandId);
  if (!brand) {
    return next(new Error("brand not found", { cause: 404 }));
  }

  //chk ids related
  if (brand.categoryID != categoryId && brand.subCategoryID != subCategoryId) {
    return next(
      new Error("data not related brand , sub and category", { cause: 400 })
    );
  }
  // get user info
  const user = req.user;
  const createdBy = user._id;
  //get all data from req.body
  const { title, desc, color, size, price, appliedDiscount, stock } = req.body;
  let priceAfterDiscount = price;
  if (appliedDiscount) {
    priceAfterDiscount = price - price * (appliedDiscount / 100);
  }
  const slug = slugify(title, "_");

  // chk req.files

  if (!req.files.length) {
    return next(new Error("please upload pictures", { cause: 400 }));
  }
  const customId = title + "_" + nanoid();
  const folder = `${process.env.folder_name}/category/${category.customId}/Subcategory/${subcategory.customId}/brand/${brand.customId}/product/${customId}`;
  // upload all img
  const Images = [];
  const publicIds = [];
  for (const file of req.files) {
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      file.path,
      {
        folder: folder,
        use_filename: true,
      }
    );
    Images.push({ secure_url, public_id });
    publicIds.push(public_id);
  }
  console.log(Images, publicIds);
  //save folder to delete cloudinary
  req.folder = folder;
  req.publicIds = publicIds;
  //create product object
  const product = {
    title,
    slug,
    desc,
    customId,
    color,
    size,
    price,
    appliedDiscount,
    priceAfterDiscount,
    stock,
    createdBy,
    Imges: Images,
    categoryId,
    subCategoryId: subcategory._id,
    brandId,
  };
  // store in DB product
  const result = await productModel.create(product);
  req.document = result;
  req.model = productModel;
  // if error delete img and return error
  if (!result) {
    await cloudinary.api.delete_resources(publicIds);
    return next(new Error("try again later", { cause: 500 }));
  }
  //kolo tamam res and say done
  return res.json({ message: "Done", success: true, result });
});

export const updateProduct = asyncHandler(async (req, res, next) => {
  // get all body data
  const { title, desc, size, color, appliedDiscount, price, stock } = req.body;
  //get productid , subcategory , category , brand
  const { productId, subCategoryId, brandId, categoryId } = req.query;
  // chk productid
  const product = await productModel.findById({
    _id: productId,
  });
  if (!product) {
    return next(new Error("product not found", { cause: 404 }));
  }
  const user = req.user;
  if (product.createdBy != user._id.toString()) {
    return next(
      new Error("you are not the owner of this product", { cause: 400 })
    );
  }
  //chk categoryId in DB
  const category = await categoryModel.findById({
    _id: categoryId || product.categoryId,
  });
  // chk if i got category id in query
  if (categoryId) {
    if (!category) {
      return next(new Error("category not found", { cause: 404 }));
    }
    //edit product
    product.categoryId = category._id;
  }
  //chk SubcategoryId in DB
  const Subcategory = await SubCategoryModel.findById({
    _id: subCategoryId || product.subCategoryId,
  });
  // chk if i got subcategory id in query
  if (subCategoryId) {
    if (!Subcategory) {
      return next(new Error("Subcategory not found", { cause: 404 }));
    }
    //edit product
    product.subCategoryId = Subcategory._id;
  }
  //chk SubcategoryId in DB
  const brand = await brandModel.findById({
    _id: brandId || product.brandId,
  });
  // chk if i got brand id id in query
  if (brandId) {
    if (!brand) {
      return next(new Error("brand not found", { cause: 404 }));
    }
    //edit product
    product.brandId = brand._id;
  }

  if (appliedDiscount && price) {
    product.priceAfterDiscount = price - price * ((appliedDiscount || 0) / 100);
    product.price = price;
    product.appliedDiscount = appliedDiscount;
  } else if (appliedDiscount) {
    product.priceAfterDiscount =
      product.price - product.price * ((appliedDiscount || 0) / 100);
    product.appliedDiscount = appliedDiscount;
  } else if (price) {
    product.priceAfterDiscount =
      price - price * ((product.appliedDiscount || 0) / 100);
    product.price = price;
  }

  if (title) {
    product.title = title;
    const slug = slugify(title);
    product.slug = slug;
  }
  if (size) product.size = size;
  if (color) product.color = color;
  if (desc) product.desc = desc;
  if (stock) product.stock = stock;

  if (req.files?.length) {
    // get previous publicIds
    let puplicIdsToRemove = [];
    let ImgArr = [];

    for (const Image of product.Imges) {
      puplicIdsToRemove.push(Image.public_id);
    }

    for (const file of req.files) {
      const { public_id, secure_url } = await cloudinary.uploader.upload(
        file.path,
        {
          folder: `${process.env.folder_name}/category/${category.customId}/Subcategory/${Subcategory.customId}/brand/${brand.customId}/product/${product.customId}`,
          use_filename: true,
        }
      );
      ImgArr.push({ public_id, secure_url });
    }
    await cloudinary.api.delete_resources(puplicIdsToRemove);
    product.Imges = ImgArr;
  }
  await product.save();
  return res.json({ message: "Done updated", success: true, result: product });
});

export const getProduct = asyncHandler(async (req, res, next) => {
  const apiFeatureInstance = new ApiFeature(productModel.find({}), req.query)
    .pagination()
    .sort()
    .select()
    .filter();
  const product = await apiFeatureInstance.MongoseQuery;
  return res
    .status(200)
    .json({ message: "Done", success: true, result: product });
});

export const searchByCategoryId = asyncHandler(async (req, res, next) => {
  const { categoryId } = req.params;
  console.log(categoryId);
  const product = await productModel.find({ categoryId: categoryId });
  return res
    .status(200)
    .json({ message: "Done", success: true, result: product });
});
