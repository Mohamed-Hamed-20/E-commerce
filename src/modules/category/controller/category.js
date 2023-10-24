import slugify from "slugify";
import { asyncHandler } from "../../../utils/errorHandling.js";
import categoryModel from "../../../../DB/models/category.model.js";
import { nanoid, customAlphabet } from "nanoid";
import cloudinary from "../../../utils/coludinaryConfigrations.js";
import SubCategoryModel from "../../../../DB/models/subcategory.model.js";
import { pagenation } from "../../../utils/pagination.js";
import brandModel from "../../../../DB/models/brand.model.js";
const generate_Nanoid = customAlphabet(
  "ABCDEFGMOH123456789abcdefghigklmnopqzw",
  7
);

//================================Create category===============================
export const createCategory = asyncHandler(async (req, res, next) => {
  const user = req.user;
  const { name } = req.body;
  if (!req.file) {
    return next(new Error("please upload a category image", { cause: 400 }));
  }
  console.log(req.file.path);

  const findCategory = await categoryModel.findOne({ name });
  if (findCategory) {
    return next(
      new Error("invalid category name already exist ,try another name", {
        cause: 400,
      })
    );
  }
  const slug = slugify(name, "_");
  const customId = name + "_" + generate_Nanoid();

  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.file.path,
    {
      folder: `${process.env.folder_name}/category/${customId}`,
      unique_filename: true,
      use_filename: true,
    }
  );
  console.log({ secure_url, public_id });
  const create = {
    name,
    slug,
    customId,
    Images: {
      public_id,
      secure_url,
    },
    createdBy: user._id,
  };

  console.log(create);
  const result = await categoryModel.create(create);
  if (!result) {
    await cloudinary.uploader.destroy(public_id);
    return next(new Error("Error Please try again later", { cause: 500 }));
  }
  return res.status(200).json({ message: "done created", result });
});

//================================Update category===============================
export const UpdateCategory = asyncHandler(async (req, res, next) => {
  //get and chk category id
  const { categoryid } = req.query;
  const findCategory = await categoryModel.findById({ _id: categoryid });
  console.log(findCategory);
  if (!findCategory) {
    return next(new Error("Invalid category ID", { cause: 404 }));
  }
  //if you got name add to DB and new slug
  if (req.body.name) {
    let { name } = req.body;
    name = name.toLowerCase();
    if (name == findCategory.name) {
      return next(
        new Error(
          "Please Inter Diffrent Name , This name you already you assign before",
          { cause: 400 }
        )
      );
    }
    const chkname = await categoryModel.findOne({ name: name });
    if (chkname) {
      return next(
        new Error("Enter differnt name ,this name already exist ", {
          cause: 404,
        })
      );
    }
    const slug = slugify(name, "_");
    findCategory.name = name;
    findCategory.slug = slug;
  }

  //if you got img delete previous and but the last img
  if (req.file) {
    // add new Image
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      req.file.path,
      {
        public_id: findCategory.Images.public_id,
      }
    );
    findCategory.Images.public_id = public_id;
    findCategory.Images.secure_url = secure_url;
  }
  //update DB
  await findCategory.save();
  // return response
  return res.json({ message: findCategory });
});

// =================================delete caategory ================================================
export const deleteCategory = asyncHandler(async (req, res, next) => {
  const { categoryId } = req.query;
  const category = await categoryModel.findByIdAndDelete(categoryId);
  if (!category) {
    return next(new Error("CategoryId not found", { cause: 404 }));
  }
  await SubCategoryModel.deleteMany({ categoryId: categoryId });
  await brandModel.deleteMany({ categoryId: categoryId });
  if (category.Images) {
    const folder = `${process.env.folder_name}/category/${category.customId}`;
    await cloudinary.api.delete_resources_by_prefix(folder);
    await cloudinary.api.delete_folder(folder);
  }
  return res.status(200).json({ message: "Done", category: category });
});

//================================get all categories with subCategories===============================
export const Get_all_Category_with_SubC = asyncHandler(
  async (req, res, next) => {
    // const categories = await categoryModel.find();
    const cursor = await categoryModel.find().cursor();
    const result = [];
    for (
      let dot = await cursor.next();
      dot != null;
      dot = await cursor.next()
    ) {
      // console.log(dot._id);
      const subCategories = await SubCategoryModel.find(
        {
          categoryID: dot._id,
        },
        { name: 1, customId: 1, slug: 1 }
      );
      const Objcategory = dot.toObject();
      Objcategory.subCategories = subCategories;
      console.log(Objcategory);
      result.push(Objcategory);
    }
    return res.status(200).json({ message: "done", category: result });
  }
);
export const searchCategory = asyncHandler(async (req, res, next) => {
  const { searchKey, page, size } = req.query;
  const { limit, skip } = pagenation({ page, size });
  const categories = await categoryModel
    .find({
      $or: [{ name: { $regex: searchKey, $regex: "i" } }],
    })
    .skip(skip)
    .limit(limit);
  return res.json({ messages: "Done", results: categories });
});
