import mongoose, { Schema, Types } from "mongoose";
import { hash, compare } from "bcrypt";
import jwt from "jsonwebtoken";
const schema = new Schema(
  {
    firstName: { type: String, required: true, min: 2, max: 20 },
    middleName: { type: String, min: 2, max: 20 },
    lastName: { type: String, required: true, min: 2, max: 20 },
    avatar: {
      url: { type: String },
      public_id: { type: String }
    },
    age: { type: Number, min: 22, max: 60, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      minLenght: [10, "email is too short"]
    },
    password: {
      type: String,
      required: true,
      minLenght: [8, "password is too short"]
    },

    role: {
      type: String,
      enum: ["superAdmin", "admin"],
      default: "admin"
    },
    classRoom: { type: Types.ObjectId, ref: "classRoom" },
    school: { type: Types.ObjectId, ref: "school" }
  },
  { timestamps: true }
);

function autoPopulateClassroomAndSchool(next) {
  this.populate("classRoom school");
  next();
}

schema.pre("findOne", autoPopulateClassroomAndSchool);
schema.pre("find", autoPopulateClassroomAndSchool);
schema.pre("findOneAndUpdate", autoPopulateClassroomAndSchool);
schema.pre("findByIdAndUpdate", autoPopulateClassroomAndSchool);
schema.pre("save", autoPopulateClassroomAndSchool);

schema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await hash(this.password, 10);
    return next();
  }
  return next();
});
schema.methods.generateToken = async function () {
  return await jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: "30d"
  });
};
schema.methods.comparePassword = async function (password) {
  return await compare(password, this.password);
};
const teacherModel = mongoose.model("teacher", schema);

export default teacherModel;
