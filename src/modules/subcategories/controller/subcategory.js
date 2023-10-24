import slugify from "slugify";
import SubCategoryModel from "../../../../DB/models/subcategory.model.js";
import { asyncHandler } from "../../../utils/errorHandling.js";
import cloudinary from "../../../utils/coludinaryConfigrations.js";
import { customAlphabet } from "nanoid";
import categoryModel from "../../../../DB/models/category.model.js";
import brandModel from "../../../../DB/models/brand.model.js";
import { pagenation } from "../../../utils/pagination.js";
const nanoid = customAlphabet(
  "ABCDEFGHIGKLMNOPQXYZasdfghjklqwertyuiopzxcvbnm",
  7
);
export const CreateSubCategory = asyncHandler(async (req, res, next) => {
  const { name } = req.body;
  const { categoryId } = req.query;
  console.log({ name, categoryId });
  //check and find CategoryId
  const Category = await categoryModel.findById({ _id: categoryId });
  if (!Category) {
    return next(new Error("Invalid category ID", { cause: 400 }));
  }
  //check unique name
  const chkname = await SubCategoryModel.findOne({ name });
  if (chkname) {
    return next(
      new Error("Invalid SC Name , is already exist :(", { cause: 400 })
    );
  }
  //create slug
  const slug = slugify(name, "_");
  //check img is sended
  if (!req.file) {
    return next(new Error("please upload PIC ", { cause: 400 }));
  }
  const customId = name + "_" + nanoid();
  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.file.path,
    {
      folder: `${process.env.folder_name}/category/${Category.customId}/Subcategory/${customId}`,
      use_filename: true,
    }
  );
  console.log({ secure_url, public_id });
  const CreteSubcategory = {
    name,
    slug,
    categoryId: categoryId,
    customId,
    Images: {
      public_id,
      secure_url,
    },
    createdBy: req.user._id,
  };
  const result = await SubCategoryModel.create(CreteSubcategory);
  if (!result) {
    const deleimg = await cloudinary.uploader.destroy(public_id);
    return res.json(new Error("please try again later", deleimg));
  }
  return res.status(200).json({ message: "done Created", result });
});

export const GetallSubCategory = asyncHandler(async (req, res, next) => {
  const result = await SubCategoryModel.find().populate([
    {
      path: "brand",
      select: " name , Images",
    },
  ]);
  return res.status(200).json({ message: "done", result });
});

export const Update_SubCategory = asyncHandler(async (req, res, next) => {
  //get categoryid and subcategoryid
  const { categoryid, subcategoryid } = req.query;
  //chk categoryid in DB
  const category = await categoryModel.findById(categoryid);
  if (!category) {
    return next(new Error("invalid category Id ", { cause: 404 }));
  }
  // chk subcategoryid in db
  const subcategory = await SubCategoryModel.findById(subcategoryid);
  if (!subcategory) {
    return next(new Error("invalid subcategory", { cause: 400 }));
  }
  //if he want to change name
  if (req.body.name) {
    const { name } = req.body;
    const slug = slugify(name.toLowerCase(), "_");
    subcategory.name = name;
    subcategory.slug = slug;
  }
  //if he want change img
  if (req.file) {
    const { public_id, secure_url } = await cloudinary.uploader.upload(
      req.file.path,
      {
        public_id: subcategory.Images.public_id,
      }
    );
    subcategory.Images.secure_url = secure_url;
  }
  //update DB and back response
  await subcategory.save();
  return res.json({ message: "Updated success", subcategory });
});

// export const Update_SubCategory = asyncHandler(async (req, res, next) => {
//   //chk categoryId
//   const { categoryId, SubCategoryId } = req.query;
//   const category = await categoryModel.findById(categoryId);
//   if (!category) {
//     return next(new Error("invaild categoryId", { cause: 404 }));
//   }
//   // Chk subcategory
//   const Subcategory = await SubCategoryModel.findById(SubCategoryId);
//   if (!Subcategory) {
//     return next(new Error("invaild SubcategoryId", { cause: 404 }));
//   }
//   // if i got name
//   if (req.body.name) {
//     const { name } = req.body;
//     const chkname = await SubCategoryModel.findOne({ name: name });
//     if (chkname) {
//       return next(
//         new Error("name subcategory is already Exist", { cause: 404 })
//       );
//     }
//     const slug = slugify(name, "_");
//     Subcategory.name = name;
//     Subcategory.slug = slug;
//   }
//   if (req.file) {
//     const { public_id, secure_url } = cloudinary.uploader.upload(
//       req.file.path,
//       {
//         public_id: Subcategory.Images.public_id,
//       }
//     );
//     Subcategory.Images.secure_url = secure_url;
//   }
//   Subcategory.createdBy = "64ebc441558097beb3813814";
//   await Subcategory.save();
//   return res.status(200).json({ message: "done", success: true, Subcategory });
// });

// export const delete_SubCategory = asyncHandler(async (req, res, next) => {
//   const { SubCategoryId, categoryId } = req.query;
//   //chk id category
//   const category = await categoryModel.findById(categoryId);
//   if (!category) {
//     return next(new Error("category Not found", { cause: 404 }));
//   }
//   await cloudinary.api.delete_resources_by_prefix(
//     `${process.env.folder_name}/category/${category.customId}/Subcategory/${subcategory.customId}`
//   );
//   await cloudinary.api.delete_folder(
//     `${process.env.folder_name}/category/${category.customId}/Subcategory/${subcategory.customId}`
//   );
//   // chk id subcategory
//   const brands = await brandModel.findByIdAndDelete({
//     subCategoryID: SubCategoryId,
//   });
//   const subcategory = await SubCategoryModel.findByIdAndDelete(SubCategoryId);
//   if (!subcategory) {
//     return next(new Error("subcategory Not found", { cause: 404 }));
//   }

//   return res.json({
//     success: true,
//     message: "Delete subcategory",
//     subcategory,
//   });
// });

export const delete_SubCategory = asyncHandler(async (req, res, next) => {
  //get categoryid and subcategoryid
  const { categoryid, subcategoryid } = req.query;
  //chk category
  const category = await categoryModel.findById({ _id: categoryid });
  if (!category) {
    return next(new Error("invalid category id", { cause: 404 }));
  }
  //chk subcategory
  const subcategory = await SubCategoryModel.findById(subcategoryid);
  if (!subcategory) {
    return next(new Error("invalid subcategory id", { cause: 404 }));
  }
  // delete imgs and all folders
  const folder = `${process.env.folder_name}/category/${category.customId}/Subcategory/${subcategory.customId}`;
  await cloudinary.api.delete_resources_by_prefix(folder);
  await cloudinary.api.delete_folder(folder);
  // delete all brands to this subcategory
  const delbrands = await brandModel.deleteMany({
    subCategoryId: subcategoryid,
  });
  if (!delbrands) {
    return next(new Error("error try again later", { cause: 500 }));
  }
  // delete subcategory
  const result = await SubCategoryModel.findByIdAndDelete(subcategoryid);
  if (!result) {
    return next(new Error("error try again later", { cause: 500 }));
  }
  // return response
  return res.status(200).json({ success: true, message: "Done", result });
});

export const searchsubCategory = asyncHandler(async (req, res, next) => {
  const { searchKey, page, size } = req.query;
  const { limit, skip } = pagenation({ page, size });
  const subcategories = await SubCategoryModel.find({
    $or: [{ name: { $regex: searchKey, $regex: "i" } }],
  })
    .skip(skip)
    .limit(limit);
  return res.json({ messages: "Done", results: subcategories });
});
