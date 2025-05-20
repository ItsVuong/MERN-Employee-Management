import { body, param } from "express-validator";
import LeaveRequestController from "../controllers/leave-request.controller";
import authenticate from "../middlewares/auth.middleware";

export const LeaveRequestRoute = [
  {
    method: "post",
    route: "/leave-request/create",
    controller: LeaveRequestController.createRequest,
    validation: [
      authenticate(),
      body("date").isDate(),
      body("reason").isString(),
    ]
  },
  {
    method: "get",
    route: "/leave-request/:userId",
    controller: LeaveRequestController.getRequestByUser,
    validation: [
      authenticate(),
      param("userId").isMongoId()
    ]
  },
  {
    method: "patch",
    route: "/leave-request",
    controller: LeaveRequestController.updateRequest,
    validation: [
      authenticate(),
      body("date").optional().isDate(),
      body("reason").optional().isString(),
    ]
  }
]

