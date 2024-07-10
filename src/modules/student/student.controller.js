import studentModel from "../../../DataBase/models/studentModel.js";
import { catchAsyncError } from "../../../middlewares/catchAsyncError.js";
import { removeImage } from "../../../middlewares/deleteImg.js";
import { AppError } from "../../../utilities/AppError.js";
import { ApiFeature } from "../../../utilities/AppFeature.js";

const createStudent = catchAsyncError(async (req, res, next) => {
  if (req.teacher.role == "admin") {
    req.body.school = req.teacher.school;
  }

  const { email } = req.body;

  const oldUser = await studentModel.findOne({
    email
  });

  if (oldUser) {
    return next(new AppError("user already exists", 400));
  }

  const student = new studentModel(req.body);
  await student.save();

  const token = await student.generateToken();
  res.status(200).send({ message: "success", data: student, token });
});

const deletestudent = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  const student = await studentModel.findByIdAndDelete(id);

  if (!student) {
    return next(new AppError("can't delete the student"));
  }

  res.status(200).send({ message: "success" });
});

const updatestudent = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  const oldStudent = await studentModel.findById(id);
  const student = await studentModel.findByIdAndUpdate(id, req.body, {
    new: true
  });
  if (!student) {
    return next(new AppError("Failed to update the student", 500));
  }

  if (req.body.avatar) {
    removeImage(oldStudent.avatar.public_id);
  }

  res.status(200).json({ message: "success", data: student });
});
const login = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;
  const student = await studentModel.findOne({ email });
  if (!student) return next(new AppError("student not found", 400));
  if (!(await student.comparePassword(password))) {
    return next(new AppError("incorrect email or password"));
  }
  const token = await student.generateToken();
  res.status(200).send({ message: "success", data: student, token });
});

const getAllStudent = catchAsyncError(async (req, res, next) => {
  const { role } = req.teacher;
  let school;
  if (role === "admin") {
    school = req.teacher.school;
  }
  if (role === "superAdmin") {
    school = req.body.schoolId;
  }
  const apiFeature = new ApiFeature(studentModel.find({ school }), req.query)
    .paginate()
    .fields()
    .filter()
    .search()
    .sort();
  const countBlogs = await studentModel.find().countDocuments();
  const pageNumber = Math.ceil(countBlogs / 20);
  const result = await apiFeature.mongoseQuery;
  if (!result) {
    return next(new AppError("can't find student"));
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
const getstudentById = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const { role, school } = req.teacher;

  const student = await studentModel.findById(id);

  if (!student) {
    return next(new AppError("Can't find this student", 404));
  }

  if (
    role === "superAdmin" ||
    (role === "admin" && student.school.equals(school))
  ) {
    res.status(200).send({ message: "success", data: student });
  } else {
    return next(new AppError("You are not authorized", 403));
  }
});

export {
  getAllStudent,
  createStudent,
  getstudentById,
  deletestudent,
  updatestudent,
  login
};
