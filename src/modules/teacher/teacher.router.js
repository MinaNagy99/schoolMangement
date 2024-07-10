import { Router } from "express";
import * as teacher from "./teacher.controller.js";
import {
  spasificTeacherSchema,
  teacherSchemaCreate,
  teacherSchemaLogin,
  teacherSchemaUpdate
} from "./teacher.validation.js";
import { allowedTo, auth } from "../../../middlewares/auth.js";
import { validation } from "../../../middlewares/validation.js";
import { upladeToCloudnairy } from "../../../middlewares/uploadToCloud.js";
import { uploadMixfile } from "../../../middlewares/fileUpload.js";

const teacherRouter = Router();
teacherRouter
  .route("/register")
  .post(
    auth,
    allowedTo("superAdmin"),
    uploadMixfile([{ name: "avatar", maxCount: 1 }]),
    upladeToCloudnairy,
    validation(teacherSchemaCreate),
    teacher.register
  );
teacherRouter
  .route("/login")
  .post(validation(teacherSchemaLogin), teacher.login);
teacherRouter
  .route("/")
  .get(auth, allowedTo("superAdmin"), teacher.getAllteachers);

teacherRouter.route("/profile").get(auth, teacher.getTeacherProfile);

teacherRouter
  .route("/:id")
  .get(
    auth,
    allowedTo("superAdmin"),
    validation(spasificTeacherSchema),
    teacher.getTeacherById
  )
  .patch(
    auth,
    allowedTo("superAdmin"),
    uploadMixfile([{ name: "avatar", maxCount: 1 }]),
    upladeToCloudnairy,
    validation(teacherSchemaUpdate),
    teacher.updateTeacherProfile
  );

export default teacherRouter;
