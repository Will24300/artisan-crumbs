import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";
const userSchema = new Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["admin", "customer"], default: "customer" },
    provider: { type: String, enum: ["local", "google", "facebook"], default: "local" },
    providerId: { type: String, default: null },
    resetPasswordToken: { type: String, default: null },
    resetPasswordExpires: { type: Date, default: null },
    createdAt: { type: Date, default: () => new Date() },
}, { timestamps: true });
userSchema.methods.comparePassword = async function (password) {
    return bcrypt.compare(password, this.passwordHash);
};
userSchema.statics.createUser = async function (name, email, password, role) {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    return this.create({ name, email, passwordHash, role, provider: "local" });
};
userSchema.statics.createSocialUser = async function (name, email, provider, providerId) {
    const randomPassword = `social_${Math.random().toString(36).slice(-8)}_${Date.now()}`;
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(randomPassword, salt);
    return this.create({ name, email, passwordHash, role: "customer", provider, providerId });
};
userSchema.statics.findByEmail = function (email) {
    return this.findOne({ email: email.toLowerCase().trim() });
};
const User = mongoose.model("User", userSchema);
export default User;
