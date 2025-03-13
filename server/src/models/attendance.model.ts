import mongoose from 'mongoose';
import userModel from './user.model';

const AttendanceSchema = new mongoose.Schema({
  employee: { type: mongoose.SchemaTypes.ObjectId, ref: userModel},
  date: { type: Date },
  status: { type: String, enum: ["Present", "Absent", "Leave"]},
  checkIn: { type: Date },
  checkOut: { type: Date },
});

export default mongoose.model("Attendance", AttendanceSchema, "Attendances");
