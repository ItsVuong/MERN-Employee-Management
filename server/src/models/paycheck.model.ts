import mongoose from "mongoose";
import userModel from "./user.model";
import allowanceModel from "./allowance.model";
import deductionModel from "./deduction.model";
import bonusModel from "./bonus.model";

const PaycheckSchema = new mongoose.Schema({
  employee: { type: mongoose.SchemaTypes.ObjectId, ref: userModel, required: true },
  month: { type: Number, required: true, min: 1, max: 12 },
  year: { type: Number, required: true, min: 2000 }, // Ensure year is a number
  paymentDate: { type: Date },
  baseSalary: { type: Number, required: true, min: 0 },

  allowances: [{ type: mongoose.SchemaTypes.ObjectId, ref: allowanceModel }],
  bonuses: [{ type: mongoose.SchemaTypes.ObjectId, ref: bonusModel }],
  deductions: [{ type: mongoose.SchemaTypes.ObjectId, ref: deductionModel }],

  netSalary: { type: Number, default: 0 },
  paymentStatus: { type: String, enum: ["paid", "unpaid"], default: "unpaid" }
});

// Index for fast lookup by month, year, and employee
PaycheckSchema.index({ month: 1, year: 1, employee: 1 }, { unique: true });

export default mongoose.model("Paycheck", PaycheckSchema, "Paychecks");

