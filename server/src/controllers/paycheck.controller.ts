import { NextFunction, Request, Response } from "express";
import paycheckModel from "../models/paycheck.model";
import userModel from "../models/user.model";
import { CustomError } from "../middlewares/error.middleware";
import allowanceModel from "../models/allowance.model";

const createPaycheck = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { employee, month, year } = req.body;
    const savedEmployee = await userModel.findById(employee);
    if (!savedEmployee) {
      throw new CustomError("User not found!", 400)
    }
    //Check if the date is after the user has started working
    const startDate = new Date(savedEmployee.startDate);
    const startYear = startDate.getFullYear();
    const startMonth = startDate.getMonth();
    if (startYear > year || (startYear == year && startMonth > month)) {
      throw new CustomError("Invalid time", 400)
    }
    const newPaycheck = new paycheckModel({
      employee, month, year, baseSalary: savedEmployee.baseSalary?.amount
    });
    const savedPaycheck = await newPaycheck.save();
    return res.json(savedPaycheck);
  } catch (error) {
    next(error)
  }
}

const getPaycheckByUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.body;
    const paycheck = await paycheckModel.find({ employee: userId })
      .populate("allowances");
    return res.json(paycheck);
  } catch (error) {
    next(error)
  }
}

const updatePaycheckByUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { ...updateData } = req.body;
    const fetchedPaycheck = await paycheckModel.findById(id).populate("allowances");
    if (!fetchedPaycheck)
      throw new CustomError("Can't find paycheck!", 400);
    const paycheck = fetchedPaycheck?.toObject();
    if (updateData.bonuses) paycheck.bonuses = updateData.bonuses;
    if (updateData.deductions) paycheck.deductions = updateData.deductions;
    if (updateData.allowances) {
      const fetchedAllowances = await allowanceModel.find({ _id: { $in: updateData.allowances } });
      paycheck.allowances = (fetchedAllowances as any)
    }
    paycheck.netSalary = calculateNetSalary(paycheck)

    const result = await updatePaycheckService(id, paycheck);
    console.log(calculateNetSalary(result))
    return res.json(result);
  } catch (error) {
    next(error)
  }
}

function calculateNetSalary(paycheck: any) {
  const baseSalary = paycheck.baseSalary || 0;
  const totalAllowances = Array.isArray(paycheck.allowances)
    ? paycheck.allowances.reduce((sum: number, a: any) => sum + (a.amount || 0), 0)
    : 0;
  const totalBonuses = Array.isArray(paycheck.bonuses)
    ? paycheck.bonuses.reduce((sum: number, b: any) => sum + (b.amount || 0), 0)
    : 0;
  const totalDeductions = Array.isArray(paycheck.deductions)
    ? paycheck.deductions.reduce((sum: number, d: any) => sum + (d.amount || 0), 0)
    : 0;

  return baseSalary + totalAllowances + totalBonuses - totalDeductions;
}


const updatePaycheckService = async (id: string, updateData: any) => {
  const updatedPaycheck = await paycheckModel.findByIdAndUpdate(id, { $set: updateData },
    { new: true, runValidators: true }
  ).populate("allowances");
  return updatedPaycheck
}

const PaycheckController = {
  createPaycheck,
  getPaycheckByUser,
  updatePaycheckByUser
};
export default PaycheckController
