import { query } from "express-validator";
import authenticate from "../middlewares/auth.middleware";
import DeductionController from "../controllers/deduction.controller";

const DeductionRoute = [
  {
    method: "post",
    route: "/deduction/create",
    controller: DeductionController.createBonus,
    validation: [
      authenticate(["Admin"])
    ]
  },
  {
    method: "get",
    route: "/deduction/",
    controller: DeductionController.getBonusByUser,
    validation: [
      authenticate(["Admin"]),
      query("userId").isMongoId()
    ]
  },
  {
    method: "delete",
    route: "/deduction/:id",
    controller: DeductionController.deleteBonus,
    validation: [
      authenticate(["Admin"]),
    ]
  }
]

export default DeductionRoute;
