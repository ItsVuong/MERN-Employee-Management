import { NextFunction, Request, Response } from "express";
import { CustomError } from "../middlewares/error.middleware";
import attendanceModel from "../models/attendance.model";
import mongoose from "mongoose";

interface UserRequest extends Request {
  user?: any,
}

const getAttendanceByUser = async (req: UserRequest, res: Response, next: NextFunction) => {
  const { userId } = req.params
  const attendanceList = await attendanceModel.find({employee: userId});
  res.json(attendanceList)
}

const checkin = async (req: UserRequest, res: Response, next: NextFunction) => {
  try {
    //get the ip of the user
    const forwardedFor = req.headers["x-forwarded-for"];
    const clientIp = Array.isArray(forwardedFor)
      ? forwardedFor[0].split(",")[0]
      : (forwardedFor?.split(",")[0] || req.ip);
    console.log("Client IP:", clientIp);

    const userId = req?.user.userId
    const date = new Date();
    //Check if user id is received from jwt token
    if (!userId) throw new CustomError("User not found", 400);
    //Check if user has already checkin that day
    const notValidCheckin = await attendanceModel.findOne({
      employee: userId,
      date: date.setHours(0, 0, 0, 0)
    });
    console.log(new Date().setHours(0, 0, 0, 0))
    console.log(date)
    console.log(notValidCheckin)
    if (notValidCheckin)
      throw new CustomError("You have already checkin today", 400);

    //Create a new attendance entry
    const newAttendance = new attendanceModel({
      employee: userId,
      date: date.setHours(0, 0, 0, 0)
    });

    const savedAttendance = await newAttendance.save();
    res.json(savedAttendance);
  } catch (error) {
    next(error);
  }
}

const checkout = async (req: UserRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req?.user.userId
    const date = new Date;
    //Check if user id is received from jwt token
    if (!userId) throw new CustomError("User not found", 400);
    //Check if the user have already checkin
    //Update checkout time
    console.log(date.toLocaleString())
    const result = await attendanceModel.findOneAndUpdate({
      employee: new mongoose.Types.ObjectId(userId),
      date: date.setHours(0, 0, 0, 0)
    }, { checkOut: Date.now() },
      { new: true });
    //Throw error if there is no entry to update
    if (!result)
      throw new CustomError("You have not checkin for today", 400)
    return res.json(result);
  } catch (error) {
    next(error);
  }
}

const AttendanceController = {
  checkin, checkout,
  getAttendanceByUser
}

export default AttendanceController
