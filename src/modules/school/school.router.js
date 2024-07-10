import { Router } from "express";
import * as school from "./school.controller.js";
import { allowedTo, auth } from "../../../middlewares/auth.js";
import {
  uploadMixfile,
  uploadSingleFile
} from "../../../middlewares/fileUpload.js";
import { upladeToCloudnairy } from "../../../middlewares/uploadToCloud.js";
import { validation } from "../../../middlewares/validation.js";
import {
  createSchoolSchema,
  SpasificSchoolSchema,
  updatedSchoolSchema
} from "./school.validation.js";
const schoolRouter = Router();

schoolRouter
  .route("/")
  .get(school.getAllschool)
  .post(
    auth,
    allowedTo("superAdmin"),
    uploadMixfile([{ name: "image", maxCount: 1 }]),
    upladeToCloudnairy,
    validation(createSchoolSchema),
    school.createschool
  );

schoolRouter
  .route("/:id")
  .get(validation(SpasificSchoolSchema), school.getschoolById)
  .delete(
    auth,
    allowedTo("superAdmin"),
    validation(SpasificSchoolSchema),
    school.deleteschool
  )
  .patch(
    auth,
    allowedTo("superAdmin"),
    uploadMixfile([{ name: "image", maxCount: 1 }]),
    upladeToCloudnairy,
    validation(updatedSchoolSchema),
    school.updateschool
  );

export default schoolRouter;
