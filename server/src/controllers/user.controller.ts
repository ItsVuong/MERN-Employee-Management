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
    console.log(role)

    //Upload file to cloudinary 
    const result = await FileUtil.uploadFile(req.file.path);
    if (!result) {
      throw new CustomError("Error uploading image");
    }
    const newUser = new userModel({
      profileImage: { url: result.url, name: result.public_id },
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
      startDate,
      // For pagination
      pageSize, currentPage
    } = req.query;
    const query: any = {};
    //Get all the query if it exists
    if (fullName) query.fullName = new RegExp(fullName, 'i'); // Case-insensitive search
    if (gender) query.gender = gender;
    if (department) query.department = new mongoose.Types.ObjectId(department);
    if (phone) query.phone = new RegExp(phone, 'i');
    if (email) query.email = new RegExp(email, 'i');
    if (role) query.role = role;
    if (startDate) {
      const date = new Date(startDate); // Convert string to Date object
      const start = new Date(date.getFullYear(), date.getMonth(), 1); // First day of the month
      const end = new Date(date.getFullYear(), date.getMonth() + 1, 1); // First day of next month

      query.startDate = { $gte: start, $lt: end };
    }

    // Salary Filtering
    if (minSalary || maxSalary) {
      query["baseSalary.amount"] = {};
      if (minSalary) query["baseSalary.amount"].$gte = parseFloat(minSalary);
      if (maxSalary) query["baseSalary.amount"].$lte = parseFloat(maxSalary);
    }

    //Pagination
    const pagination: { limit: number, skip: number } = { limit: 20, skip: 0 }
    if (pageSize && currentPage) {
      const count = await userModel.countDocuments({ ...query });
      const divide = Number(count / pageSize);
      const pages = Math.ceil(divide);

      if (currentPage <= pages && currentPage > 0) {
        pagination.limit = pageSize;
        pagination.skip = (currentPage - 1) * pageSize
      }
    }

    //Get the number of all users for pagination
    const total = await userModel.countDocuments(query);
    // Execute the query
    const userList = await userModel.find(query, null, pagination)
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
        department: user.department,
        startDate: user.startDate,
        role: user.role,
        paidLeave: user.paidLeave
      }
    });
    return res.json({ data: reshapedUser, totalCount: total });
  } catch (error: any) {
    next(error)
  }
}

const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const user = await userModel.findById(id)
      .populate("department");
    if (!user) throw new CustomError("User id not found", 400);
    const reshapedUser = {
      avatar: user.profileImage,
      id: user._id,
      fullName: user.fullName,
      dob: user.dob,
      address: user.address,
      phone: user.phone,
      salary: user.baseSalary,
      email: user.email,
      gender: user.gender,
      department: user.department,
      startDate: user.startDate,
      role: user.role,
      paidLeave: user.paidLeave
    }
    res.json(reshapedUser);
  } catch (error) {
    next(error);
  }
}

const updateUser = async (req: Request<{ id: string }, {}, UpdateUserDto>, res: Response) => {
  try {
    console.log(req.body)
    const { id } = req.params;
    const { password, ...updateData } = req.body; // Fields to update
    // Remove undefined fields from updateData
    const filteredUpdate = Object.fromEntries(
      Object.entries(updateData).filter(([_, value]) => value !== undefined)
    );

    // Check if user exists
    const existingUser = await userModel.findById(id);
    if (!existingUser) {
      return res.status(404).json({ error: "User not found" });
    }
    //If profile pic is uploaded
    if (req.file) {
      const oldImage = existingUser.profileImage;
      if (!req.file) {
        throw new CustomError("No file is uploaded", 400);
      }
      //Upload file to cloudinary 
      const result = await FileUtil.uploadFile(req.file.path);
      //Delete old image if it exists
      if (oldImage?.name)
        FileUtil.deleteFile(oldImage.name);
      //Put the new Image in the update data
      if (result)
        filteredUpdate.profileImage = { url: result.url, name: result.public_id }
    }
    if (updateData.baseSalary) {
      filteredUpdate.baseSalary = {
        amount: Number(updateData.baseSalary), // Correct conversion
      };
    }

    // Update the user with the provided fields
    const updatedUser = await updateUserService(id, filteredUpdate);

    const reshapedUser = {
      avatar: updatedUser.profileImage,
      id: updatedUser._id,
      fullName: updatedUser.fullName,
      dob: updatedUser.dob,
      address: updatedUser.address,
      phone: updatedUser.phone,
      salary: updatedUser.baseSalary,
      email: updatedUser.email,
      gender: updatedUser.gender,
      department: updatedUser.department,
      startDate: updatedUser.startDate,
      role: updatedUser.role,
      paidLeave: updatedUser.paidLeave
    }

    res.json(reshapedUser);
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
  ).populate("department");
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
    const updatedUser = await updateUserService(userId, { profileImage: { url: result.url, name: result.public_id } });
    //Delete old image if it exists
    if (oldImage?.name)
      FileUtil.deleteFile(oldImage.name);
    res.json(updatedUser);
  } catch (error) {
    next(error);
  }
}

const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.params;
    const deletedUser = await userModel.findByIdAndDelete(userId);
    res.json(deletedUser);
  } catch (error) {
    next(error)
  }
}

const UserController = {
  getUsers,
  createUser,
  updateUser,
  updatePassword,
  getUserById,
  deleteUser
}
export default UserController;
