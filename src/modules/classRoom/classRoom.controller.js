import classRoomModel from "../../../DataBase/models/classRoomModel.js";
import { catchAsyncError } from "../../../middlewares/catchAsyncError.js";
import { removeImage } from "../../../middlewares/deleteImg.js";
import { AppError } from "../../../utilities/AppError.js";
import { ApiFeature } from "../../../utilities/AppFeature.js";

const createclassRoom = catchAsyncError(async (req, res, next) => {
  if (req.teacher.role == "admin") {
    req.body.school = req.teacher.school;
  }

  const classRoom = await classRoomModel.create(req.body);

  if (!classRoom) {
    return next(new AppError("can't create classRoom"));
  }
  res.status(200).send({ message: "success", data: classRoom });
});

const deleteclassRoom = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  const classRoom = await classRoomModel.findByIdAndDelete(id);

  if (!classRoom) {
    return next(new AppError("can't delete the classRoom"));
  }

  res.status(200).send({ message: "success" });
});

const updateclassRoom = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  const classRoom = await classRoomModel.findByIdAndUpdate(id, req.body, {
    new: true
  });
  if (!classRoom) {
    return next(new AppError("Failed to update the classRoom", 500));
  }

  res.status(200).json({ message: "success", data: classRoom });
});

const getAllclassRoom = catchAsyncError(async (req, res, next) => {
  const { role } = req.teacher;
  let school;
  if (role === "admin") {
    school = req.teacher.school;
  }
  if (role === "superAdmin") {
    school = req.body.schoolId;
  }
  const apiFeature = new ApiFeature(classRoomModel.find({ school }), req.query)
    .paginate()
    .fields()
    .filter()
    .search()
    .sort();
  const countBlogs = await classRoomModel.find().countDocuments();
  const pageNumber = Math.ceil(countBlogs / 20);
  const result = await apiFeature.mongoseQuery;
  if (!result) {
    return next(new AppError("can't find classRoom"));
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
const getclassRoomById = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const { role, school } = req.teacher;

  const classRoom = await classRoomModel.findById(id);

  if (!classRoom) {
    return next(new AppError("Can't find this classRoom", 404));
  }

  if (
    role === "superAdmin" ||
    (role === "admin" && classRoom.school.equals(school))
  ) {
    res.status(200).send({ message: "success", data: classRoom });
  } else {
    return next(new AppError("You are not authorized", 403));
  }
});

export {
  getAllclassRoom,
  createclassRoom,
  getclassRoomById,
  deleteclassRoom,
  updateclassRoom
};
