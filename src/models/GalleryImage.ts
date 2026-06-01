import mongoose, { Schema } from "mongoose";

const GalleryImageSchema = new Schema(
  {
    title: { type: String, required: true },
    category: { type: String, required: true },
    image: { type: String, required: true },
    shape: { type: String, default: "" },
    order: { type: Number, default: 0 },
  },
  { timestamps: true, strict: true },
);

export default mongoose.models.GalleryImage ||
  mongoose.model("GalleryImage", GalleryImageSchema);
