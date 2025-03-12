import mongoose from 'mongoose';

const PermissionSchema = new mongoose.Schema({
  name: { type: String, required: true},
  description: { type: String, required: true},
});

export default mongoose.model("Permission", PermissionSchema, "Permissions");
