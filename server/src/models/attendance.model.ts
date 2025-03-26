import mongoose from 'mongoose';
import userModel from './user.model';

const AttendanceSchema = new mongoose.Schema({
  employee: { type: mongoose.SchemaTypes.ObjectId, ref: userModel},
  date: { type: Date },
  //status: { type: String, enum: ["Present", "Absent", "Leave"]},
  checkIn: { type: Date, default: Date.now() },
  checkOut: { type: Date },
});
// Employee and date together is unique
AttendanceSchema.index({ employee: 1, date: 1 }, { unique: true });

export default mongoose.model("Attendance", AttendanceSchema, "Attendances");
