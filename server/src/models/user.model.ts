import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import departmentModel from './department.model';
import { UpdateUserDto } from '../dto/user.dto';

const UserSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  dob: { type: Date },
  gender: { type: String, enum: ["Male", "Female"] },
  address: { type: String },
  phone: { type: String },
  department: { type: mongoose.Schema.Types.ObjectId, ref: departmentModel },
  baseSalary: {
    type: {
      amount: { type: Number, required: true },
      startDate: { type: Date, required: true, default: Date.now() },
    }
  },
  startDate: { type: Date, default: Date.now() },
  profileImage: {
    type: {
      url: String,
      //This field is actually used to store cloudinary file's public id
      name: String
    }
  },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["Admin", "User"], default: "User" },
  paidLeave: { type: Number, default: 12 }
});

//Hash password before create
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

//Hash password before update
UserSchema.pre("findOneAndUpdate", async function(next) {
  const update = this.getUpdate() as { '$set': UpdateUserDto };
  //Set start date for base salary if it is updated
  if (update['$set']?.baseSalary?.amount) {
    console.log("hello")
    this.set({ baseSalary: { amount: update["$set"].baseSalary.amount, startDate: new Date() } });
  }
  //Hash password if password is updated
  if (!update['$set']?.password) {
    return next();
  }
  const hash = await bcrypt.hash(update['$set'].password, 10);
  this.setUpdate({ password: hash });
  next();
});

export default mongoose.model("User", UserSchema, "Users");
