import { NextFunction, Request, Response } from "express";

import jwt from "jsonwebtoken";
import { AuthUserDto } from "../dto/auth.dto";
import { CustomError } from "./error.middleware";
import userModel from "../models/user.model";

interface AuthRequest extends Request {
  user?: AuthUserDto
}

const authenticate = (requiredRole?: [string]) =>
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers["authorization"];
      //Validate token
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return next(new CustomError("Access denied", 401))
      }
      const token = authHeader.split(' ')[1];
      if (!token)
        return next(new CustomError("Access denied", 400));

      //Token authentication
      const accessToken = process.env.ACCESS_TOKEN_SECRET || "";
      const decoded: AuthUserDto = await new Promise((resolve: any, reject: any) => {
        jwt.verify(token, accessToken, (err, user: any) => {
          if (err) {
            reject(new CustomError("Access denied", 401))
          }
          //Put user object in request
          req.user = user;
          resolve(user);
        });
      });

      //Role based authentication
      if (requiredRole) {
        const savedUser = await userModel.findById(decoded.userId);
        if (savedUser && !requiredRole.includes(savedUser?.role)) {
          next(new CustomError("User is not allowed to perform this action", 401))
        }
      }
      next();
    } catch (error) {
      next(error)
    }
  }

export default authenticate;
