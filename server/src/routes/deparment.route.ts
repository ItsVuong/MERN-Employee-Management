import DepartmentController from "../controllers/department.controller";
import UserController from "../controllers/user.controller";

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
    validation: []
  }
]

