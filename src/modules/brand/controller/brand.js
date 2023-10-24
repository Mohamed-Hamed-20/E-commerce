import slugify from "slugify";
import categoryModel from "../../../../DB/models/category.model.js";
import SubCategoryModel from "../../../../DB/models/subcategory.model.js";
import { asyncHandler } from "../../../utils/errorHandling.js";
import cloudinary from "../../../utils/coludinaryConfigrations.js";
import { customAlphabet } from "nanoid";
import brandModel from "../../../../DB/models/brand.model.js";
import { pagenation } from "../../../utils/pagination.js";
const nanoid = customAlphabet(
  "ASDFGHJKLQWERTYUIOPMNBVCXZasdfghjklmnbvcxzqwertyuiop1234567890",
  7
);
export const createBrand = asyncHandler(async (req, res, next) => {
  let { name } = req.body;
  name = name.toLowerCase();
  const { subCategoryID, categoryID } = req.query;
  //console.log(nameFE,name, categoryID, subCategoryID);
  const chksubCategoryID = await SubCategoryModel.findById({
    _id: subCategoryID,
    categoryID: categoryID,
  });
  if (!chksubCategoryID) {
    return next(new Error("invalid categories", { cause: 400 }));
  }

  const slug = slugify(name, {
    replacement: "_",
    lower: true,
  });
  if (!req.file) {
    return next(new Error("please upload ur logo"));
  }
  const category = await categoryModel.findById({ _id: categoryID });
  if (!category) {
    return next(new Error("invalid category id ", { cause: 404 }));
  }
  const customId = name + "_" + nanoid();

  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.file.path,
    {
      folder: `${process.env.folder_name}/category/${category.customId}/Subcategory/${chksubCategoryID.customId}/brand/${customId}`,
      use_filename: true,
    }
  );
  console.log(secure_url, public_id);
  const createbrand = {
    name,
    slug,
    customId,
    logo: { secure_url, public_id },
    subCategoryID,
    categoryID,
  };
  const brand = await brandModel.create(createbrand);
  if (!brand) {
    await cloudinary.uploader.destroy(public_id);
    return next(new Error("Error please try again later", { cause: 500 }));
  }
  return res.status(201).json({ message: "done created brand", brand });
});

export const updateBrand = asyncHandler(async (req, res, next) => {
  //get category subcategory brand
  const { categoryID, subCategoryID, brandid } = req.query;
  // chk all this
  const category = await categoryModel.findById({ _id: categoryID });
  if (!category) {
    return next(new Error("invalid category id ", { cause: 404 }));
  }
  const subCategory = await SubCategoryModel.findById({ _id: subCategoryID });
  if (!subCategory) {
    return next(new Error("invalid subCategory id ", { cause: 404 }));
  }
  const brand = await brandModel.findById({ _id: brandid });
  if (!brand) {
    return next(new Error("invalid brand id ", { cause: 404 }));
  }
  //if req.body.name
  if (req.body.name) {
    let name = req.body.name.toLowerCase();
    const slug = slugify(name, "_");
    brand.slug = slug;
    brand.name = name;
  }
  //chk if req.file
  if (req.file) {
    //delete by publicid for img
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      req.file.path,
      {
        public_id: brand.logo.public_id,
      }
    );
    brand.logo.secure_url = secure_url;
    brand.logo.public_id = public_id;
  }
  // update brandmodel
  brand.categoryID = category._id;
  brand.subCategoryID = subCategory._id;
  await brand.save();
  //return response
  return res.json({ success: true, message: "done", brand });
});

export const deleteBrand = asyncHandler(async (req, res, next) => {
  //get brand ID to delete
  const { brandId } = req.query;
  // chk is IN DB
  const brand = await brandModel.findById({ _id: brandId });
  if (!brand) {
    return next(new Error("invalid brand Id ", { cause: 404 }));
  }
  const category = await categoryModel.findById(brand.categoryId);
  const subcategory = await subcategory.findById(brand.subCategoryId);
  //delete brand img from DB with folder and product folder
  folder = `${process.env.folder_name}/category/${category.customId}/subcategory/`;
  const deleteImage = await cloudinary.api.delete_resources_by_prefix({
    fold,
  });
  //chk img is deleted
  //delete his product
  //chk its product deleted if no
  // delete brand
  //chk id deleted
});

export const searchbrand = asyncHandler(async (req, res, next) => {
  const { searchKey, page, size } = req.query;
  console.log({ searchKey, page, size });
  const { limit, skip } = pagenation({ page, size });
  const brands = await brandModel
    .find({
      $or: [{ name: { $regex: searchKey, $regex: "i" } }],
    })
    .skip(skip)
    .limit(limit);
  return res.json({ messages: "Done brands", results: brands });
});
