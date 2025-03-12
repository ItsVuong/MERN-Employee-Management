import UserController from "../controllers/user.controller";

export const UserRoute = [
  {
    method: "get",
    route: "/user",
    controller: UserController.getUsers,
    validation: []
  },
  {
    method:"post",
    route: "/user/create",
    controller: UserController.createUser,
    validation: []
  }
]
