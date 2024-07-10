import classRoomModel from "../DataBase/models/classRoomModel.js";
import studentModel from "../DataBase/models/studentModel.js";
import teacherModel from "../DataBase/models/teacherModel.js";
import { AppError } from "../utilities/AppError.js";
import { catchAsyncError } from "./catchAsyncError.js";
import jwt from "jsonwebtoken";
export const auth = catchAsyncError(async (req, res, next) => {
  const { token } = req.headers;
  if (!token) return next(new AppError("token not provider", 401));
  jwt.verify(token, process.env.JWT_SECRET, async function (err, decoded) {
    if (err) return next(new AppError(err.message));
    const { id } = decoded;
    const teacher = await teacherModel.findById(id).select("-password");
    if (!teacher) return next(new AppError("teacher not authorized", 401));

    req.teacher = teacher;
    next();
  });
});

export const allowedTo = (...role) => {
  return catchAsyncError(async (req, res, next) => {
    if (!role.includes(req.teacher.role))
      return next(
        new AppError(`you are not authorized you are ${req.teacher.role}`, 401)
      );

    next();
  });
};

export const authorization = (model) => {
  return catchAsyncError(async (req, res, next) => {
  
    if (model == "classRoom") {
      const { id } = req.params;
      const { role, school } = req.teacher;
      const classRoom = await classRoomModel.findById(id);

      const isAuthorized =
        (role === "admin" && classRoom.school === school) ||
        role === "superAdmin";

      if (!isAuthorized) {
        return next(
          new AppError("You are not authorized to access this resource", 403)
        );
      } else {
        next();
      }
    }
    if (model == "student") {
      const { id } = req.params;
      const { role, school } = req.teacher;
      const student = await studentModel.findById(id);

      const isAuthorized =
        (role === "admin" && student.school === school) ||
        role === "superAdmin";

      if (!isAuthorized) {
        return next(
          new AppError("You are not authorized to access this resource", 403)
        );
      } else {
        next();
      }
    }
  });
};
