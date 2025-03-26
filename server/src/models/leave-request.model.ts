import mongoose from 'mongoose';
import userModel from './user.model';

const LeaveRequestSchema = new mongoose.Schema({
  employee: { type: mongoose.SchemaTypes.ObjectId, ref: userModel },
  date: { type: Date },
  reason: { type: String },
  isPaidLeave: {type: Boolean}
});
// Employee and date together is unique
LeaveRequestSchema.index({ employee: 1, date: 1 }, { unique: true });

export default mongoose.model("LeaveRequest", LeaveRequestSchema, "LeaveRequests");
