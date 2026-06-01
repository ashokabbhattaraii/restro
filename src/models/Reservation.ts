import mongoose, { Schema } from "mongoose";

const ReservationSchema = new Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String },
    date: { type: String, required: true, index: true },
    time: { type: String, required: true },
    guests: { type: Number, required: true },
    occasion: { type: String },
    requests: { type: String },
    status: {
      type: String,
      enum: ["Confirmed", "Pending", "Cancelled"],
      default: "Pending",
    },
  },
  { timestamps: true, strict: true },
);

export default mongoose.models.Reservation ||
  mongoose.model("Reservation", ReservationSchema);
