import mongoose from "mongoose";
import departmentModel from "../models/department.model";
import userModel from "../models/user.model";

export const isEmailUnique = async (value: String) => {
  const user = await userModel.findOne({ email: value });
  if (user) {
    throw new Error('E-mail already in use');
  }
  return true;
}

export const existDepartment = async (value: String) => {
  if(!mongoose.isValidObjectId(value)){
    throw new Error('Invalid department Id');
  }
  const department = await departmentModel.findById(value);
  if (!department) {
    throw new Error('Department does not exist');
  }
  return true;
}
