import mongoose, { Schema } from "mongoose";

const MenuItemSchema = new Schema(
  {
    name: { type: String, required: true },
    category: { type: String, required: true, index: true },
    description: { type: String, required: true },
    price: { type: String, required: true },
    dietary: [{ type: String }],
    image: { type: String, required: true },
    featured: { type: Boolean, default: false },
    visible: { type: Boolean, default: true },
  },
  { timestamps: true, strict: true },
);

export default mongoose.models.MenuItem || mongoose.model("MenuItem", MenuItemSchema);
