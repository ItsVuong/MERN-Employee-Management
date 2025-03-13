import { body, param } from "express-validator";
import DepartmentController from "../controllers/department.controller";

export const DepartmentRoute = [
  {
    method: "get",
    route: "/department",
    controller: DepartmentController.getDepartments,
    validation: []
  },
  {
    method:"post",
    route: "/department/create",
    controller: DepartmentController.createDepartment,
    validation: [
      body("name").isString(),
      body("description").isString(),
    ]
  }
]
