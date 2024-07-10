import { Router } from "express";
import * as classRoom from "./classRoom.controller.js";
import { allowedTo, auth, authorization } from "../../../middlewares/auth.js";
import { validation } from "../../../middlewares/validation.js";
import {
  createClassRoomSchema,
  getAllclassRoomSchema,
  SpasificClassRoomSchema,
  updatedClassRoomSchema
} from "./classRoom.validation.js";
const classRoomRouter = Router();

classRoomRouter
  .route("/")
  .get(
    auth,
    allowedTo("admin", "superAdmin"),
    validation(getAllclassRoomSchema),
    classRoom.getAllclassRoom
  )
  .post(
    auth,
    allowedTo("superAdmin", "admin"),

    validation(createClassRoomSchema),
    classRoom.createclassRoom
  );

classRoomRouter
  .route("/:id")

  .delete(
    auth,
    allowedTo("superAdmin", "admin"),
    authorization("classRoom"),
    validation(SpasificClassRoomSchema),
    classRoom.deleteclassRoom
  )
  .patch(
    auth,
    allowedTo("superAdmin", "admin"),
    authorization("classRoom"),
    validation(updatedClassRoomSchema),
    classRoom.updateclassRoom
  );

export default classRoomRouter;
