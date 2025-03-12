import mongoose from 'mongoose';

const RoleSchema = new mongoose.Schema({
  name: { type: String, required: true},
  permission: {type: mongoose.Schema.ObjectId, ref: "Permissions"}
});

export default mongoose.model("Role", RoleSchema, "Roles");
