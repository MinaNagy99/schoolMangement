import { Router } from "express";
import * as Student from "./student.controller.js";
import { allowedTo, auth, authorization } from "../../../middlewares/auth.js";
import { validation } from "../../../middlewares/validation.js";
import {
  createStudentSchema,
  getAllStudentSchema,
  SpasificStudnetSchema,
  updatedStudentSchema
} from "./student.validation.js";
import { upladeToCloudnairy } from "../../../middlewares/uploadToCloud.js";
import { uploadMixfile } from "../../../middlewares/fileUpload.js";
const StudentRouter = Router();

StudentRouter.route("/")
  .get(
    auth,
    allowedTo("admin", "superAdmin"),
    validation(getAllStudentSchema),
    Student.getAllStudent
  )
  .post(
    auth,
    allowedTo("superAdmin", "admin"),
    uploadMixfile([{ name: "avatar", maxCount: 1 }]),
    upladeToCloudnairy,
    validation(createStudentSchema),
    Student.createStudent
  );

StudentRouter.route("/:id")

  .delete(
    auth,
    allowedTo("superAdmin", "admin"),
    authorization("student"),
    validation(SpasificStudnetSchema),
    Student.deletestudent
  )
  .patch(
    auth,
    allowedTo("superAdmin", "admin"),
    authorization("student"),
    uploadMixfile([{ name: "avatar", maxCount: 1 }]),
    upladeToCloudnairy,
    validation(updatedStudentSchema),
    Student.updatestudent
  );

export default StudentRouter;
