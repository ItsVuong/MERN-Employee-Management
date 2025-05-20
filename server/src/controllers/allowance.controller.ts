import { NextFunction, Request, Response } from "express";
import allowanceModel from "../models/allowance.model";

const createAllowance = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { employeeId, type, amount } = req.body;
    const newAllowance = new allowanceModel({
      employeeId, type, amount
    });
    const savedAllowance = await newAllowance.save();
    res.json(savedAllowance);
  } catch (error) {
    next(error)
  }
}

const getAllowance = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { type, amount, isActive } = req.query;
    const query: any = {};
    if (type) query.type = new RegExp((type as string), 'i');
    if (amount) query.amount = amount;
    if (isActive) query.isActive = isActive;
    const allowanceList = await allowanceModel.find(query);
    res.json(allowanceList);
  } catch (error) {
    next(error)
  }
}

const updateAllowance = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { employee, type, amount } = req.body;
    const result = await allowanceModel.findByIdAndUpdate(id, { employee, type, amount }, { new: true });
    return res.json(result);
  } catch (error) {
    next(error);
  }
}

const deleteAllowance = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const result = await allowanceModel.findByIdAndDelete(id);
    return res.json(result);
  } catch (error) {
    next(error);
  }
}

const AllowanceController = {
  deleteAllowance,
  updateAllowance,
  getAllowance,
  createAllowance
}

export default AllowanceController
