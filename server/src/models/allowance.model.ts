import mongoose from 'mongoose';
import userModel from './user.model';

const AllowanceTypes = ["Transport allowance", "Housing allowance", "Meal allowance", "Car allowance"]

const AllowanceSchema = new mongoose.Schema({
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: userModel, required: true },
  type: { type: String, required: true, enum: AllowanceTypes },
  amount: { type: Number, required: true },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

AllowanceSchema.index({ amount: 1, type: 1 }, { unique: true });

export default mongoose.model("Allowance", AllowanceSchema, "Allowances");
