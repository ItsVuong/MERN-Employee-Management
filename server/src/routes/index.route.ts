import { NextFunction, Request, Response, Router } from "express";
import express from 'express';
import { UserRoute } from "./user.route";
import handleError from "../middlewares/error.middleware";
import { DepartmentRoute } from "./deparment.route";

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
      //Pass request to controllers
      route.controller,
      //Error middlewares
      handleError
    )
  }
);

export default router.use('/api', router);
