import { NextFunction, Response, Request } from "express";
import { CustomError } from "../middlewares/error.middleware";
import leaveRequestModel from "../models/leave-request.model";
import { CreateLeaveReqDto } from "../dto/leave-request.dto";
import mongoose from "mongoose";

const getRequestByUser = async (req: Request, res: Response, next: NextFunction) => {
  const {userId} = req.body;
  const requests = await leaveRequestModel.find({employee: userId});
}
const createRequest = async (req: CreateLeaveReqDto, res: Response, next: NextFunction) => {
  try {
    const userId = req?.user.userId
    const { date, reason } = req.body;
    //Make sure the date in the request is in the future
    const userDate = new Date(date);
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0)
    if (userDate < currentDate)
      throw new CustomError("Invalid date!", 400)

    //Check if user id is received from jwt token
    if (!userId) throw new CustomError("User not found", 400);

    const newRequest = new leaveRequestModel({
      date: date,
      reason: reason
    });
    const savedRequest = await newRequest.save();
    res.json(savedRequest);
  } catch (error) {
    next(error);
  }
}

const updateRequest = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId, date, reason } = req.body;
    //Make sure the date in the request is in the future
    const userDate = new Date(date);
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0)
    if (userDate < currentDate)
      throw new CustomError("Invalid date!", 400)

    const result = await leaveRequestModel.findByIdAndUpdate(
      { employee: new mongoose.Types.ObjectId(userId) }, {
      date: date, reason: reason
    });
    res.json(result);
  } catch (error) {
    next(error)
  }
}

const LeaveRequestController = {
  createRequest,
  updateRequest
}
export default LeaveRequestController
