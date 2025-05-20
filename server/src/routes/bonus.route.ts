import { query } from "express-validator";
import BonusController from "../controllers/bonus.controller";
import authenticate from "../middlewares/auth.middleware";

const BonusRoute = [
  {
    method: "post",
    route: "/bonus/create",
    controller: BonusController.createBonus,
    validation: [
      authenticate(["Admin"])
    ]
  },
  {
    method: "get",
    route: "/bonus/",
    controller: BonusController.getBonusByUser,
    validation: [
      authenticate(["Admin"]),
      query("userId").isMongoId()
    ]
  },
  {
    method: "delete",
    route: "/bonus/:id",
    controller: BonusController.deleteBonus,
    validation: [
      authenticate(["Admin"]),
    ]
  }
]

export default BonusRoute;
