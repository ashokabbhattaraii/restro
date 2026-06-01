import mongoose, { Schema } from "mongoose";

const StaffSchema = new Schema(
  {
    name: { type: String, required: true },
    role: { type: String, required: true },
    department: { type: String, required: true },
    bio: { type: String, required: true },
    image: { type: String, required: true },
    visible: { type: Boolean, default: true, index: true },
  },
  { timestamps: true, strict: true },
);

export default mongoose.models.Staff || mongoose.model("Staff", StaffSchema);
