import { NextFunction, Request, Response } from "express";
import bonusModel from "../models/bonus.model";
import paycheckModel from "../models/paycheck.model";
import { CustomError } from "../middlewares/error.middleware";

const createBonus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = req.body;
    const newBonus = new bonusModel(data);
    const savedBonus = await newBonus.save();
    return res.json(savedBonus);
  } catch (error) {
    next(error)

  }
}

const getBonusByUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.query;
    const bonuses = await bonusModel.find({ employeeId: userId });
    return res.json(bonuses);
  } catch (error) {
    next(error);
  }
}

const updateBonus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { updateData } = req.body;
    const updatedBonus = await bonusModel.findOneAndUpdate({ _id: id }, { $set: updateData });
    return res.json(updatedBonus);
  } catch (error) {
    next(error);
  }
}

const deleteBonus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const paychecks = await paycheckModel.find({
      bonuses: id, // Look for this bonus ID in the bonuses array
      paymentStatus: "Paid"
    })
    if(paychecks){
      throw new CustomError("Can't delete this data", 400);
    }
    const result = await bonusModel.findByIdAndDelete(id);

    return res.json({message: "Delete successfully", deleted: result});
  } catch (error) {
    next(error);
  }
}

const BonusController = {
  createBonus,
  deleteBonus,
  updateBonus,
  getBonusByUser
}

export default BonusController;
