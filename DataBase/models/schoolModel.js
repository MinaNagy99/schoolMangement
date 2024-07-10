import mongoose, { Schema } from "mongoose";

const schema = new Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  educationalLevel: {
    type: String,
    required: true,
    enum: [
      "Kindergarten",
      "Elementary School",
      "Middle School",
      "High School",
      "Undergraduate",
      "Graduate",
      "Postgraduate"
    ]
  },
  image: {
    url: { type: String, required: true },
    public_id: { type: String, required: true }
  },
  tuitionExpenses: [
    {
      levelName: { type: String, required: true },
      tuitionExpensesPerStudent: {
        type: Number,
        required: true,
        min: 200,
        max: 300000
      },
      tuitionExpensesPerYear: {
        type: Number,
        required: true,
        min: 200,
        max: 300000
      },
      tuitionExpensesPerSemester: {
        type: Number,
        required: true,
        min: 200,
        max: 300000
      },
      tuitionExpensesPerTerm: {
        type: Number,
        required: true,
        min: 200,
        max: 300000
      }
    }
  ],
  educationalAdministration: {
    type: String,
    required: true,
    enum: [
      "South Giza",
      "North Cairo",
      "Al-Haram",
      "Al-Omraneya",
      "North Delta",
      "New Valley"
    ]
  }
});

const schoolModel = mongoose.model("school", schema);

export default schoolModel;
