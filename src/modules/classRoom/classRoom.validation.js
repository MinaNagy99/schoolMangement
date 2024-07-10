import joi from "joi";

const { name, school, building, floor, id } = {
  id: joi.string().hex().length(24),
  school: joi.string().hex().length(24),
  name: joi.string().min(2).max(100),
  building: joi.string().min(2).max(100),
  floor: joi.number().min(0).max(10)
};

export const createClassRoomSchema = joi.object({
  name: name.required(),
  school: school,
  building: building.required(),
  floor: floor.required()
});

export const updatedClassRoomSchema = joi.object({
  name: name,
  school: school,
  building: building,
  floor: floor,
  id: id.required()
});
export const SpasificClassRoomSchema = joi.object({
  id: id.required()
});
export const getAllclassRoomSchema = joi.object({
  schoolId: id
})
