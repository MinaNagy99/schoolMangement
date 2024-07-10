import joi from "joi";

const {
  name,
  location,
  educationalAdministration,
  image,
  tuitionExpenses,
  educationalLevel,
  id
} = {
  id: joi.string().hex().length(24),
  name: joi.string().min(3).max(100),
  location: joi.string().min(2).max(700),
  educationalLevel: joi
    .string()
    .valid(
      "Kindergarten",
      "Elementary School",
      "Middle School",
      "High School",
      "Undergraduate",
      "Graduate",
      "Postgraduate"
    ),
  image: joi.object({
    url: joi.string(),
    public_id: joi.string()
  }),
  tuitionExpenses: joi.array().items(
    joi.object({
      levelName: joi.string().min(5).max(100),
      tuitionExpensesPerStudent: joi.number().min(200).max(30000),
      tuitionExpensesPerYear: joi.number().min(200).max(30000),
      tuitionExpensesPerSemester: joi.number().min(200).max(30000),
      tuitionExpensesPerTerm: joi.number().min(200).max(30000),
      tuitionExpensesPerStudent: joi.number().min(200).max(30000)
    })
  ),
  educationalAdministration: joi
    .string()
    .valid(
      "South Giza",
      "North Cairo",
      "Al-Haram",
      "Al-Omraneya",
      "North Delta",
      "New Valley"
    )
};

export const createSchoolSchema = joi.object({
  name: name.required(),
  location: location.required(),
  educationalLevel: educationalLevel.required(),
  image: image.required(),
  tuitionExpenses: tuitionExpenses.required(),
  educationalAdministration: educationalAdministration.required()
});

export const updatedSchoolSchema = joi.object({
  name,
  location,
  educationalAdministration,
  image,
  tuitionExpenses,
  educationalLevel,
  id: id.required()
});
export const SpasificSchoolSchema = joi.object({
  id: id.required()
});
