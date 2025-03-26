import mongoose from 'mongoose';
import userModel from './user.model';
import allowanceModel from './allowance.model';

const PaycheckSchema = new mongoose.Schema({
  employee: { type: mongoose.SchemaTypes.ObjectId, ref: userModel },
  month: { type: Number, required: true, min: 1, max: 12 },
  year: { type: String },
  paymentDate: { type: Date },
  baseSalary: { type: Number },
  allowances: [
    {
      type: mongoose.SchemaTypes.ObjectId, ref: allowanceModel
    }
  ],
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
  paymentStatus: { type: String, enum: ["Paid", "Unpaid"], default: "Unpaid" },
});

PaycheckSchema.index({ month: 1, year: 1, employee: 1 }, { unique: true });

export default mongoose.model("Paycheck", PaycheckSchema, "Paychecks");
