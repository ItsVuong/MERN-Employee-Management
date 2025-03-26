import { NextFunction, Request, Response } from "express";
import holidayModel from "../models/holiday.model";
import { CustomError } from "../middlewares/error.middleware";

const createHoliday = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { date, name, duration = 1 } = req.body;
    const formatedDate = new Date(date);
    formatedDate.setHours(0, 0, 0, 0)
    //Create an array of existed holidays to check if the added holidays have already exist
    const endDate = formatedDate.getTime() + duration * 24 * 60 * 60 * 1000;
    const existedHolidays = await holidayModel.find({ date: { $gte: formatedDate, $lte: new Date(endDate) } }); //Get all the holiday in the range of formatedDate to endDate
    const existedDates = existedHolidays.map(e => new Date((e.date as any)).getTime());

    //Create an array of dates based on the duration of the holiday
    const holidayEntries = Array.from({ length: duration }, (_, i) => {
      //Convert value to number with getTime() for comparing
      const calculatedDate = new Date(formatedDate.getTime() + i * 24 * 60 * 60 * 1000)
      //Filtering out all the existed holidays
      if (!existedDates.includes(calculatedDate.getTime()))
        return {
          date: calculatedDate,
          name: name
        }
    });
    //The filter lists will contain undefined value which need to be filter out
    const filteredList = holidayEntries.filter(Boolean)
    const savedHoliday = await holidayModel.insertMany(filteredList);
    return res.json(savedHoliday);
  } catch (error) {
    next(error)
  }
}

const getHolidays = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { startDate, endDate } = req.query;
    const holidays = await holidayModel.find({
      //date: { $gte: startDate, $lte: endDate }
    });
    return res.json(holidays);
  } catch (error) {
    next(error)
  }
}

const updateHolidays = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const result = await holidayModel.findOneAndUpdate({ _id: id }, { name }, { new: true });
    if (!result) {
      throw new CustomError("Holiday does not exists", 400);
    }
    return res.json(result)
  } catch (error) {
    next(error);
  }
}

const deleteHoliday = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const result = await holidayModel.findByIdAndDelete(id);
    if (!result) {
      throw new CustomError("Holiday does not exists", 400);
    }
    return res.json(result);
  } catch (error) {
    next(error)
  }
}

const HolidayController = {
  createHoliday,
  getHolidays,
  updateHolidays,
  deleteHoliday
}
export default HolidayController;
