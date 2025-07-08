import mongoose from "mongoose";

const todoSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  text: { type: String, required: true },
  reminderTime: Date,
  reminded: { type: Boolean, default: false },
  isCompleted: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Todo", todoSchema);
