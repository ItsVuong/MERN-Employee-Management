import { body, param, query } from "express-validator";
import HolidayController from "../controllers/holiday.controller";
import authenticate from "../middlewares/auth.middleware";

export const HolidayRoute = [
  {
    method: "get",
    route: "/holidays",
    controller: HolidayController.getHolidays,
    validation: [
      authenticate(),
    ]
  },
  {
    method: "post",
    route: "/holidays/create",
    controller: HolidayController.createHoliday,
    validation: [
      authenticate(),
      body("duration").optional().isInt({min: 1}).withMessage("Invalid duration!"),
      body("name").isString().withMessage("Invalid name!"),
      body("date").isDate().withMessage("Invalid date!"),
    ]
  },
  {
    method: "patch",
    route: "/holidays/update/:id",
    controller: HolidayController.updateHolidays,
    validation: [
      authenticate(),
      param("id").isMongoId().withMessage("Invalid id!"),
      body("name").notEmpty().isString().withMessage("Invalid name!"),
    ]
  },
  {
    method: "delete",
    route: "/holidays/delete/:id",
    controller: HolidayController.deleteHoliday,
    validation: [
      authenticate(),
      param("id").isMongoId().withMessage("Invalid id!")
    ]
  },
]
