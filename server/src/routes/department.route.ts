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
  },
  {
    method:"put",
    route:"/department/update/:deptId",
    controller: DepartmentController.updateDepartment,
    validation: [
      param("deptId").isMongoId(),
      body("name").optional().notEmpty().isString(),
      body("description").optional().notEmpty().isString(),
    ]
  },
  {
    method:"delete",
    route:"/department/delete/:deptId",
    controller: DepartmentController.deleteDepartment,
    validation: [
      param("deptId").isMongoId(),
    ]
  }
]
