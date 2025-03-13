import { NextFunction, Request, Response, Router } from "express";
import express from 'express';
import { UserRoute } from "./user.route";
import handleError, { CustomError } from "../middlewares/error.middleware";
import { DepartmentRoute } from "./department.route";
import { validationResult } from "express-validator";
import { CustomValidation } from "express-validator/lib/context-items";

const router = express.Router();

// An array of all routes
const AllRoutes = [
  ...UserRoute,
  ...DepartmentRoute
];

AllRoutes.forEach(
  route => {
    (router as any)[route.method](route.route,
      //Validation middlewares
      ...route.validation,
      (req: Request, res: Response, next: NextFunction) => {
        const result = validationResult(req);
        if (result.isEmpty()) {
          return next();
        }
        const validationErrors = new CustomError("Invalid request", 400);
        validationErrors.errors = result.array();
        throw validationErrors;
      },
      //Pass request to controllers
      route.controller,
      //Error middlewares
      handleError
    )
  }
);

export default router.use('/api', router);
