import mongoose, { Schema } from "mongoose";

const MessageSchema = new Schema(
  {
    name: { type: String, required: true },
    phone: { type: String },
    email: { type: String },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    read: { type: Boolean, default: false, index: true },
    replied: { type: Boolean, default: false },
  },
  { timestamps: true, strict: true },
);

export default mongoose.models.Message || mongoose.model("Message", MessageSchema);
