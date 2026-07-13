import mongoose, { Document, Model, Schema } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser {
  name: string;
  email: string;
  passwordHash: string;
  role: "admin" | "customer";
  createdAt: Date;
}

export interface IUserDocument extends IUser, Document {
  comparePassword(password: string): Promise<boolean>;
}

interface IUserModel extends Model<IUserDocument> {
  createUser(name: string, email: string, password: string, role: "admin" | "customer"): Promise<IUserDocument>;
  findByEmail(email: string): Promise<IUserDocument | null>;
}

const userSchema = new Schema<IUserDocument, IUserModel>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["admin", "customer"], default: "customer" },
    createdAt: { type: Date, default: () => new Date() },
  },
  { timestamps: true },
);

userSchema.methods.comparePassword = async function (password: string) {
  return bcrypt.compare(password, this.passwordHash);
};

userSchema.statics.createUser = async function (
  name: string,
  email: string,
  password: string,
  role: "admin" | "customer",
) {
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);
  return this.create({ name, email, passwordHash, role });
};

userSchema.statics.findByEmail = function (email: string) {
  return this.findOne({ email: email.toLowerCase().trim() });
};

const User = mongoose.model<IUserDocument, IUserModel>("User", userSchema);

export default User;
