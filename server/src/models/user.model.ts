import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const UserSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  dob: { type: Date },
  address: { type: String },
  phone: { type: String },
  department: { type: String },
  salary: { type: Number },
  startDate: { type: Date, default: Date.now() },
  profileImage: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["Admin", "User"], default: "User" },
});

UserSchema.pre("save", async function(next) {
  console.log("middlware: ", this)
  if (!this.isModified("password")) {
    return next();
  }
  const hash = await bcrypt.hash(this.password, 10);
  this.password = hash;
  console.log(hash)
  next();
});

UserSchema.pre("findOneAndUpdate", async function(next) {
  if (!(this as any)._update.password) {
    return next();
  }
  const hash = await bcrypt.hash((this as any)._update.password, 10);
  (this as any)._update.password = hash;
  next();
});



export default mongoose.model("User", UserSchema, "Users");
