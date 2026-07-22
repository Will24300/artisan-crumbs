import mongoose, { Schema } from "mongoose";
const feedbackSchema = new Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    subject: { type: String, default: "General Inquiry", trim: true },
    message: { type: String, required: true, trim: true },
    createdAt: { type: Date, default: () => new Date() },
}, { timestamps: true });
const Feedback = mongoose.model("Feedback", feedbackSchema);
export default Feedback;
