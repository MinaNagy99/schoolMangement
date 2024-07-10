import { AppError } from "../utilities/AppError.js";
import teacherRouter from "./modules/teacher/teacher.router.js";
import classRoomRouter from "./modules/classRoom/classRoom.router.js";
import schoolRouter from "./modules/school/school.router.js";
import StudentRouter from "./modules/student/student.router.js";

function init(app) {
  app.use("/api/teacher", teacherRouter);
  app.use("/api/classRoom", classRoomRouter);
  app.use("/api/school", schoolRouter);
  app.use("/api/student", StudentRouter);

  app.all("*", (req, res, next) => {
    next(new AppError(`can't find ${req.originalUrl} on this server`, 404));
  });
}

export default init;
