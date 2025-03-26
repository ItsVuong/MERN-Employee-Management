import { NextFunction, Request, Response } from "express";
import userModel from "../models/user.model";
import { CustomError } from "../middlewares/error.middleware";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

async function login(req: Request, res: Response, next: NextFunction) {
  const { email, password } = req.body;
  const user = await userModel.findOne({ 'email': email });
  if (!user) {
    return next(new CustomError("Fail to authenticate", 401));
  }
  const validatePassword = await bcrypt.compare(password, user.password);
  if (!validatePassword) {
    return next(new CustomError("Fail to authenticate", 401));
  }
  const token = jwt.sign({ userId: user._id, email: user.email, role: user.role },
    process.env.ACCESS_TOKEN_SECRET || "");
  return res.json({ message: 'Login successful', token: token });
}

const AuthController = {
  login
}
export default AuthController
