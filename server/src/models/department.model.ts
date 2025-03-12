import mongoose from 'mongoose';

const DepartmentSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true},
  description: { type: String }
});

export default mongoose.model("Department", DepartmentSchema, "Departments");
