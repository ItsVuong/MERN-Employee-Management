import { body, param } from "express-validator";
import UserController from "../controllers/user.controller";
import { isEmailUnique, existDepartment } from "../utils/validator";
import authenticate from "../middlewares/auth.middleware";
import multer from "multer";
import multerUpload from "../config/multer.config";

export const UserRoute = [
  {
    method: "get",
    route: "/user",
    controller: UserController.getUsers,
    validation: [
      authenticate(['User']),
    ]
  },
  {
    method: "post",
    route: "/user/create",
    controller: UserController.createUser,
    validation: [
      body('fullName').isString().notEmpty(),
      body('gender').optional().isString().isIn(['Male', 'Female'])
        .withMessage('Gender must be either Male or Female'),
      body('email').notEmpty().isEmail().custom(isEmailUnique),
      body('address').isString().notEmpty(),
      body('phone').isString().isLength({ min: 10, max: 11 }),
      body('department').optional().custom(existDepartment),
      body('startDate').optional().isDate(),
      body('dob').optional().isDate(),
      body('password').notEmpty().isString()
        .matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/),
      body('role').optional().isString(),
      body('baseSalary').optional().isInt({ min: 0 })
        .withMessage("Base salary must be higher than 0")
    ]
  },
  {
    method: "put",
    route: "/user/:id",
    controller: UserController.updateUser,
    validation: [
      body('fullName').isString().notEmpty(),
      body('gender').optional().isString().isIn(['Male', 'Female'])
        .withMessage('Gender must be either Male or Female'),
      body('address').isString().notEmpty(),
      body('phone').isString().isLength({ min: 10, max: 11 }),
      body('department').optional().custom(existDepartment),
      body('startDate').optional().isDate(),
      body('dob').optional().isDate(),
      body('password').notEmpty().isString()
        .matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/),
      body('role').optional().isString(),
      body('baseSalary').optional().isInt({ min: 0 })
        .withMessage("Base salary must be higher than 0")
    ]
  },
  {
    method: "patch",
    route: "/user/change-password/",
    controller: UserController.updatePassword,
    validation: [
      body('newPassword').notEmpty().isString()
        .matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/),
    ]
  },
  {
    method: "post",
    route: "/user/upload-avatar/",
    controller: UserController.uploadProfilePic,
    validation: [
      multerUpload.single('image')
    ]
  }
]
