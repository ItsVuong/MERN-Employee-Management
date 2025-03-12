import { NextFunction, Request, Response } from "express"
import { CustomError } from "../middlewares/error.middleware";
import userModel from "../models/user.model";

async function createUser(req: Request, res: Response, next: NextFunction) {
  try {
    const { fullName, dob, address, phone, salary, email, password } =req.body;
    const newUser = new userModel({
      fullName: fullName,
      dob: dob,
      address: address,
      phone: phone,
      salary: salary,
      email: email,
      password: password
    });
    const savedUser = await newUser.save();
    return res.json(savedUser);
  } catch (error: any) {
    next(error)
  }
}

async function getUsers(req: Request, res: Response, next: NextFunction) {
  try {
    const userList = await userModel.find();
    const reshapedUser = userList.map(e => {
      const user = e.toObject(); 
      return {
       fullName: user.fullName,
        dob: user.dob,
        address: user.address,
        phone: user.phone,
        salary: user.salary,
        email: user.email
      }
    });
    return res.json(reshapedUser);
  } catch (error: any) {
    next(error)
  }
}

const UserController = {
  getUsers,
  createUser
}
export default UserController;
