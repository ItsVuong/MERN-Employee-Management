import mongoose from 'mongoose';
import userModel from './user.model';

const AllowanceSchema = new mongoose.Schema({
  employee: { type: mongoose.SchemaTypes.ObjectId, ref: userModel},
  type: { type: String },
  ammount: { type: Number },
});

export default mongoose.model("Allowance", AllowanceSchema, "Allowances");
