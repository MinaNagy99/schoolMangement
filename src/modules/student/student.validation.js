import Joi from "joi";

const {
  firstName,
  middleName,
  lastName,
  age,
  email,
  password,
  address,
  classRoom,
  school,
  avatar,
  id
} = {
  firstName: Joi.string().min(2).max(20),
  middleName: Joi.string().min(2).max(20),
  lastName: Joi.string().min(2).max(20),
  age: Joi.number().min(5).max(25),
  email: Joi.string().email(),
  password: Joi.string(),
  address: Joi.string().min(2).max(1000),
  classRoom: Joi.string().hex().length(24),
  school: Joi.string().hex().length(24),
  id: Joi.string().hex().length(24),
  avatar: Joi.object({
    url: Joi.string(),
    public_id: Joi.string()
  })
};

export const createStudentSchema = Joi.object({
  firstName: firstName.required(),
  middleName: middleName,
  lastName: lastName.required(),
  age: age.required(),
  email: email.required(),
  password: password.required(),
  address: address.required(),
  classRoom: classRoom.required(),
  school: school.required(),
  avatar: avatar
});

export const updatedStudentSchema = Joi.object({
  firstName: firstName,
  middleName: middleName,
  lastName: lastName,
  age: age,
  email: email,
  password: password,
  address: address,
  classRoom: classRoom,
  school: school,
  avatar: avatar,
  id: id.required()
});
export const SpasificStudnetSchema = Joi.object({
  id: id.required()
});
export const getAllStudentSchema = Joi.object({
  schoolId: id
});
