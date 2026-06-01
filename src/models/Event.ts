import mongoose, { Schema } from "mongoose";

const EventSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String },
    image: { type: String, required: true },
    type: { type: String },
    active: { type: Boolean, default: true },
  },
  { timestamps: true, strict: true },
);

export default mongoose.models.Event || mongoose.model("Event", EventSchema);
