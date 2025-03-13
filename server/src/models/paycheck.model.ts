import mongoose from 'mongoose';
import userModel from './user.model';

const month = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"]

const PaycheckSchema = new mongoose.Schema({
  employee: { type: mongoose.SchemaTypes.ObjectId, ref: userModel },
  month: { type: String, enum: month},
  year: { type: String },
  paymentDate: { type: Date },
  baseSalary: { type: Number },
  totalAllowances: { type: Number, default: 0 },
  bonuses: {
    type: [{
      amount: { type: Number, default: 0 },
      reason: { type: String }
    }]
  },
  deductions: {
    type: [{
      amount: { type: Number, default: 0 },
      reason: { type: String }
    }]
  },
  netSalary: { type: Number, default: 0 },
  paymentStatus: { type: String, enum: ["Paid", "Unpaid"] },
});

export default mongoose.model("Paycheck", PaycheckSchema, "Paychecks");

