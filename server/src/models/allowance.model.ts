import mongoose from 'mongoose';

const AllowanceTypes = ["Transport allowance", "Housing allowance", "Meal allowance", "Car allowance"]

const AllowanceSchema = new mongoose.Schema({
  type: { type: String, required: true, enum: AllowanceTypes },
  amount: { type: Number, required: true },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

AllowanceSchema.index({ amount: 1, type: 1 }, { unique: true });

export default mongoose.model("Allowance", AllowanceSchema, "Allowances");
