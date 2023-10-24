import cloudinary from "./coludinaryConfigrations.js";

export const asyncHandler = (controller) => {
  return (req, res, next) => {
    controller(req, res, next).catch(async (error) => {
      if (req.folder) {
        await cloudinary.api.delete_resources(req.publicIds);
        await cloudinary.api.delete_folder(req.folder);
        await cloudinary.api.delete_resources_by_prefix(req.folder);
      }
      if (req.document && req.model) {
        await req.model.findByIdAndDelete({ _id: req.document._id });
      }
      return res
        .status(error.cause || 500)
        .json({ message: error.message, stack: error.stack });
    });
  };
};

export const GlobalErrorHandling = (error, req, res, next) => {
  return res
    .status(error.cause || 500)
    .json({ messageG: error.message, stackG: error.stack });
};
