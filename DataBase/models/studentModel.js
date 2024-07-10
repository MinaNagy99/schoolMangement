import mongoose, { Schema, Types } from "mongoose";
import { hash, compare } from "bcrypt";
import jwt from "jsonwebtoken";
const schema = new Schema(
  {
    firstName: { type: String, required: true, min: 2, max: 20 },
    middleName: { type: String, min: 2, max: 20 },
    lastName: { type: String, required: true, min: 2, max: 20 },
    age: { type: Number, min: 5, max: 25, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    address: { type: String, min: 2, max: 1000, required: true },
    classRoom: { type: Types.ObjectId, ref: "classRoom", required: true },
    school: { type: Types.ObjectId, ref: "school", required: true },
    avatar: {
      url: { type: String },
      public_id: { type: String }
    }
  },
  { timestamps: true }
);

function autoPopulateSchool(next) {
  this.populate([
    {
      path: "classRoom"
    },
    {
      path: "school"
    }
  ]);
  next();
}

schema.pre("findOne", autoPopulateSchool);
schema.pre("find", autoPopulateSchool);
schema.pre("findOneAndUpdate", autoPopulateSchool);
schema.pre("findByIdAndUpdate", autoPopulateSchool);
schema.pre("save", autoPopulateSchool);

schema.methods.comparePassword = async function (password) {
  return await compare(password, this.password);
};

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
const studentModel = mongoose.model("student", schema);

export default studentModel;
