import teacherModel from "../../../DataBase/models/teacherModel.js";
import { catchAsyncError } from "../../../middlewares/catchAsyncError.js";
import { removeImage } from "../../../middlewares/deleteImg.js";
import { AppError } from "../../../utilities/AppError.js";
import { ApiFeature } from "../../../utilities/AppFeature.js";
const register = catchAsyncError(async (req, res, next) => {
  const { email } = req.body;

  const oldUser = await teacherModel.findOne({
    email
  });

  if (oldUser) {
    return next(new AppError("user already exists", 400));
  }

  const teacher = new teacherModel(req.body);
  await teacher.save();

  const token = await teacher.generateToken();
  res.status(200).send({ message: "success", data: teacher, token });
});

const getAllteachers = catchAsyncError(async (req, res, next) => {
  const apiFeature = new ApiFeature(teacherModel.find(), req.query)
    .paginate()
    .fields()
    .filter()
    .sort()
    .search();
  const result = await apiFeature.mongoseQuery;

  const count = await teacherModel.find().countDocuments();
  const pageNumber = Math.ceil(count / 20);
  !result && new AppError("can't find teachers");
  res.status(200).send({
    message: "success",
    data: result,
    pageNumber,
    page: apiFeature.page
  });
});

const login = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;
  const teacher = await teacherModel.findOne({ email });
  if (!teacher) return next(new AppError("teacher not found", 400));
  if (!(await teacher.comparePassword(password))) {
    return next(new AppError("incorrect email or password"));
  }
  const token = await teacher.generateToken();
  res.status(200).send({ message: "success", data: teacher, token });
});

const getTeacherById = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const teacher = await teacherModel.findById(id);
  if (!teacher) {
    return next(new AppError("can't find teacher"));
  }
  res.status(200).send({ message: "success", data: teacher });
});

const updateTeacherProfile = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const { avatar } = await teacherModel.findByIdAndUpdate(id, req.body);
  removeImage(avatar.public_id);
  res.status(200).send({ message: "success" });
});

const getTeacherProfile = catchAsyncError(async (req, res, next) => {
  const { _id } = req.teacher;
  const teacher = await teacherModel.findById(_id);
  if (!teacher) {
    return next(new AppError("can't find teacher"));
  }
  res.status(200).send({ message: "success", data: teacher });
});

export {
  login,
  register,
  getTeacherProfile,
  updateTeacherProfile,
  getTeacherById,
  getAllteachers
};
