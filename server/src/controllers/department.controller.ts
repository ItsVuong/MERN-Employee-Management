import { NextFunction, Request, Response } from "express";
import departmentModel from "../models/department.model";

async function getDepartments(req: Request, res: Response, next: NextFunction) {
  try {
    const department = await departmentModel.find();
    return res.json(department);
  } catch (error: any) {
    next(error)
  }
}

async function createDepartment(req: Request, res: Response, next: NextFunction) {
  try {
    const { name, description } = req.body;
    const newDepartment = new departmentModel({
      name: name,
      description: description
    });
    const savedDepartment = await newDepartment.save();
    return res.json(savedDepartment);
  } catch (error: any) {
    next(error)
  }
}

const DepartmentController = {
  getDepartments,
  createDepartment,
}
export default DepartmentController;
