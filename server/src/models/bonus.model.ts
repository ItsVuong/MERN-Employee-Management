import mongoose from "mongoose";
import userModel from "./user.model";

const BonusSchema = new mongoose.Schema({
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: userModel, required: true },
  amount: { type: Number, required: true, min: 0 },
  reason: { type: String, required: true, trim: true },
  applyToMonth: { type: Number, required: true, min: 1, max: 12 },
  applyToYear: { type: Number, required: true, min: 2000 },
  dateIssued: { type: Date, default: Date.now },
  status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" }
});

export default mongoose.model("Bonus", BonusSchema, "Bonuses");
