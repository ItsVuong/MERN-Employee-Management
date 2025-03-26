import { body, param, query } from "express-validator";
import AllowanceController from "../controllers/allowance.controller";
import authenticate from "../middlewares/auth.middleware";

const AllowanceRoute = [
  {
    method: "get",
    route: "/allowance",
    controller: AllowanceController.getAllowance,
    validation: [
      authenticate(["Admin"]),
    ]
  },
  {
    method: "post",
    route: "/allowance/create",
    controller: AllowanceController.createAllowance,
    validation: [
      authenticate(["Admin"]),
      body("employee").isMongoId().withMessage("Employee id is invalid!"),
      body("type").isString().withMessage("Invalid type!"),
      body("amount").isInt({min: 0}).withMessage("Invalid amount!"),
    ]
  },
  {
    method: "patch",
    route: "/allowance/update/:id",
    controller: AllowanceController.updateAllowance,
    validation: [
      authenticate(["Admin"]),
      param("id").isMongoId().withMessage("Id is invalid!"),
      body("type").optional().isString().withMessage("Invalid type!"),
      body("amount").optional().isInt({min: 0}).withMessage("Invalid amount!"),
    ]
  },
  {
    method: "delete",
    route: "/allowance/delete/:id",
    controller: AllowanceController.deleteAllowance,
    validation: [
      authenticate(["Admin"]),
    ]
  },
]
export default AllowanceRoute
