import { NextFunction, Request, Response } from "express";
import departmentModel from "../models/department.model";
import { deleteModel } from "mongoose";

async function getDepartments(req: Request<{}, {}, {}, { pageSize: number, currentPage: number }>, res: Response, next: NextFunction) {
  try {
    const {
      pageSize, currentPage
    } = req.query;
    // For pagination
    const pagination: { limit: number, skip: number } = { limit: 20, skip: 0 }
    if (pageSize && currentPage) {
      const count = await departmentModel.countDocuments({});
      const divide = Number(count / pageSize || 0);
      const pages = Math.ceil(divide);

      if (currentPage <= pages && currentPage > 0) {
        pagination.limit = pageSize;
        pagination.skip = (currentPage - 1) * pageSize
      }
    }
    const total = await departmentModel.countDocuments();

    const department = await departmentModel.find({}, null, pagination);

    return res.json({ departments: department, total: total });
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

const updateDepartment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { deptId } = req.params;
    const updatedDept = await departmentModel.findByIdAndUpdate(deptId, { $set: req.body });
    return res.json(updatedDept)
  } catch (error) {
    next(error)
  }
}

const deleteDepartment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {deptId} = req.params;
    const deletedUser = await departmentModel.findByIdAndDelete(deptId);
    return res.json(deletedUser)
  } catch (error) {
    next(error)
  }
}


const DepartmentController = {
  getDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment
}
export default DepartmentController;
