import mongoose, { Schema, Types } from "mongoose";

const schema = new Schema(
  {
    name: { type: String, required: true, min: 2, max: 20 },
    school: { type: Types.ObjectId, required: true, ref: "school" },
    building: { type: String, required: true },
    floor: { type: Number, required: true, min: 0, max: 10 },
  },
  { timestamps: true }
);

function autoPopulateSchool(next) {
  this.populate([
    {
      path: 'school',
      select: 'name image educationalAdministration',
    },
  ]);
  next();
}

schema.pre('findOne', autoPopulateSchool);
schema.pre('find', autoPopulateSchool);
schema.pre('findOneAndUpdate', autoPopulateSchool);
schema.pre('findByIdAndUpdate', autoPopulateSchool);
schema.pre('save', autoPopulateSchool);





const classRoomModel = mongoose.model("classRoom", schema);

export default classRoomModel;
