import { NextFunction, Request, Response } from "express"
import userModel from "../models/user.model";
import { GetUserDto, UpdatePasswordDto, UpdateUserDto } from "../dto/user.dto";
import { CustomError } from "../middlewares/error.middleware";
import bcrypt from "bcrypt";
import FileUtil from "../utils/cloudinary.util";
import mongoose from "mongoose";

async function createUser(req: Request, res: Response, next: NextFunction) {
  try {
    const { fullName, dob, address, phone, email, password,
      department, gender, baseSalary, startDate, role } = req.body;
    const newUser = new userModel({
      fullName: fullName,
      dob: dob,
      address: address,
      phone: phone,
      gender: gender,
      password: password,
      baseSalary: { amount: baseSalary },
      email: email,
      department: department,
      startDate: startDate,
      role: role,
    });
    const savedUser = await newUser.save();
    return res.json(savedUser);
  } catch (error: any) {
    next(error)
  }
}

async function getUsers(req: Request<{}, {}, {}, GetUserDto>, res: Response, next: NextFunction) {
  try {
    const {
      fullName,
      gender,
      department,
      phone,
      email,
      role,
      minSalary,
      maxSalary,
    } = req.query;
    const query: any = {};

    if (fullName) query.fullName = new RegExp(fullName, 'i'); // Case-insensitive search
    if (gender) query.gender = gender;
    if (department) query.department = department;
    if (phone) query.phone = new RegExp(phone, 'i');
    if (email) query.email = new RegExp(email, 'i');
    if (role) query.role = role;

    // Salary Filtering
    if (minSalary || maxSalary) {
      query["baseSalary.amount"] = {};
      if (minSalary) query["baseSalary.amount"].$gte = parseFloat(minSalary);
      if (maxSalary) query["baseSalary.amount"].$lte = parseFloat(maxSalary);
    }

    // Execute the query
    const userList = await userModel.find(query)
      .populate("department");
    const reshapedUser = userList.map(e => {
      const user = e.toObject();
      return {
        id: user._id,
        fullName: user.fullName,
        dob: user.dob,
        address: user.address,
        phone: user.phone,
        salary: user.baseSalary,
        email: user.email,
        gender: user.gender,
        department: user.department
      }
    });
    return res.json(reshapedUser);
  } catch (error: any) {
    next(error)
  }
}

const updateUser = async (req: Request<{ id: string }, {}, UpdateUserDto>, res: Response) => {
  try {
    const { id } = req.params;
    const { password, ...updateData } = req.body; // Fields to update

    // Check if user exists
    const existingUser = await userModel.findById(id);
    if (!existingUser) {
      return res.status(404).json({ error: "User not found" });
    }

    // Update the user with the provided fields
    const updatedUser = await updateUserService(id, updateData);

    res.json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const updatePassword = async (req: Request<{}, {}, UpdatePasswordDto>, res: Response, next: NextFunction) => {
  try {
    const { oldPassword, newPassword, confirmPassword, id } = req.body;
    const user = await userModel.findById(id);
    if (user) {
      const validatePassword = await bcrypt.compare(newPassword, user.password);
      if (validatePassword)
        throw new CustomError("Old password is incorrect", 400);
    }
    if (newPassword !== confirmPassword)
      throw new CustomError("New password confirmation fail", 400);
    const result = await updateUserService(id, { password: oldPassword });
    if (!result) throw new CustomError("Something has gone wrong");
    res.send({ message: "Password has been updated" });
  } catch (error) {
    next(error);
  }
}

const updateUserService = async (id: string, updateData: UpdateUserDto) => {
  // Update the user with the provided fields
  const updatedUser = await userModel.findByIdAndUpdate(
    id,
    { $set: updateData },
    { new: true, runValidators: true } // Return updated user & validate schema
  );
  return updatedUser;
}

const uploadProfilePic = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.body;
    const checkUser = await userModel.findById(userId);
    if (!checkUser) {
      throw new CustomError("User does not exist!", 400);
    }
    const oldImage = checkUser.profileImage;
    if (!req.file) {
      throw new CustomError("No file is uploaded", 400);
    }
    //Upload file to cloudinary 
    const result = await FileUtil.uploadFile(req.file.path);
    const updatedUser = await updateUserService(userId, { profileImage: {url:result.url, name: result.public_id} });
    //Delete old image if it exists
    if (oldImage?.name)
      FileUtil.deleteFile(oldImage.name);
    res.json(updatedUser);
  } catch (error) {
    next(error);
  }
}

const UserController = {
  getUsers,
  createUser,
  updateUser,
  updatePassword,
  uploadProfilePic
}
export default UserController;
