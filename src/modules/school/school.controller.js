import schoolModel from "../../../DataBase/models/schoolModel.js";
import { catchAsyncError } from "../../../middlewares/catchAsyncError.js";
import { removeImage } from "../../../middlewares/deleteImg.js";
import { AppError } from "../../../utilities/AppError.js";
import { ApiFeature } from "../../../utilities/AppFeature.js";

const createschool = catchAsyncError(async (req, res, next) => {
  const school = await schoolModel.create(req.body);

  !school && next(new AppError("can't create school"));
  res.status(200).send({ message: "success", data: school });
});

const deleteschool = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const school = await schoolModel.findByIdAndDelete(id);

  !school && next(new AppError("can't delete the school"));

  removeImage(school.image.public_id);

  res.status(200).send({ message: "success" });
});

const updateschool = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const school = await schoolModel.findByIdAndUpdate(id, req.body);

  if (!school) {
    return next(new AppError("Can't find this school", 404));
  }
  req.body.image && removeImage(school.image.public_id);

  res.status(200).send({ message: "success" });
});

const getAllschool = catchAsyncError(async (req, res, next) => {
  const apiFeature = new ApiFeature(schoolModel.find(), req.query)
    .paginate()
    .fields()
    .filter()
    .search()
    .sort();
  const countBlogs = await schoolModel.find().countDocuments();
  const pageNumber = Math.ceil(countBlogs / 20);
  const result = await apiFeature.mongoseQuery;
  if (!result) {
    return next(new AppError("can't find school"));
  }
  res.status(200).send({
    message: "Success",
    data: {
      page: apiFeature.page,
      result,
      pageNumber
    }
  });
});
const getschoolById = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const school = await schoolModel.findById(id);
  if (!school) {
    return next(new AppError("Can't find this school", 404));
  }
  res.status(200).send({ message: "success", data: school });
});

export {
  getAllschool,
  createschool,
  getschoolById,
  deleteschool,
  updateschool
};
