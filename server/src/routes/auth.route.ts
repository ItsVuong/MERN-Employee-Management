import { body, param } from "express-validator";
import AuthController from "../controllers/auth.controller";

export const AuthRoute = [
  {
    method:"post",
    route: "/auth/login",
    controller: AuthController.login,
    validation: [
      body('email').isEmail(),
      body('password').isString()
    ]
  }
]

