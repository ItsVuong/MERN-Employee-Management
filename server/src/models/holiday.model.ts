import mongoose from 'mongoose';

const HolidaySchema = new mongoose.Schema({
  date: { type: Date },
  name: { type: String, default: "Off day" },
});
// Employee and date together is unique

export default mongoose.model("Holiday", HolidaySchema, "Holidays");
