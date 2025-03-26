import AttendanceController from "../controllers/attendance.controller";
import authenticate from "../middlewares/auth.middleware";

export const AttendanceRoute = [
  {
    method: "get",
    route: "/attendance/:userId",
    controller: AttendanceController.getAttendanceByUser,
    validation: [authenticate(["Admin"])]
  },
  {
    method: "post",
    route: "/attendance/checkin",
    controller: AttendanceController.checkin,
    validation: [authenticate()]
  },
  {
    method: "post",
    route: "/attendance/checkout",
    controller: AttendanceController.checkout,
    validation: [authenticate()]
  }
];
