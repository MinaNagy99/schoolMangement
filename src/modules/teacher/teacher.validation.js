import joi from "joi";

const teacherSchema = {
  firstName: joi.string().min(2).max(15),
  middleName: joi.string().min(2).max(15),
  lastName: joi.string().min(2).max(15),
  id: joi.string().hex().length(24),
  classRoom: joi.string().hex().length(24),
  school: joi.string().hex().length(24),
  avatar: joi.object({
    url: joi.string(),
    public_id: joi.string()
  }),
  age: joi.number().min(22).max(60),

  email: joi
    .string()
    .pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$/),
  password: joi.string().pattern(/^(?=.*[A-Za-z])(?=.*\d).{8,}$/),
  rePassword: joi.any().equal(joi.ref("password")).required()
};
//=================================================================
const teacherSchemaLogin = joi.object({
  email: teacherSchema.email.required(),
  password: teacherSchema.password.required()
});

const spasificTeacherSchema = joi.object({
  id: teacherSchema.id.required()
});
const teacherSchemaCreate = joi.object({
  firstName: teacherSchema.firstName.required(),
  middleName: teacherSchema.middleName,
  lastName: teacherSchema.lastName.required(),
  classRoom: teacherSchema.classRoom,
  school: teacherSchema.school,
  avatar: teacherSchema.avatar,
  age: teacherSchema.age.required(),
  email: teacherSchema.email.required(),
  password: teacherSchema.password.required(),
  rePassword: teacherSchema.password.required()
});
const teacherSchemaUpdate = joi.object({
  firstName: teacherSchema.firstName,
  middleName: teacherSchema.middleName,
  lastName: teacherSchema.lastName,
  classRoom: teacherSchema.classRoom,
  school: teacherSchema.school,
  avatar: teacherSchema.avatar,
  age: teacherSchema.age,
  email: teacherSchema.email,
  password: teacherSchema.password,
  id: teacherSchema.id.required()
});

export {
  teacherSchemaCreate,
  teacherSchemaLogin,
  teacherSchemaUpdate,
  spasificTeacherSchema
};
