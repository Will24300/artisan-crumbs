import dotenv from "dotenv";
dotenv.config();
import express from "express";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { validatePassword } from "../utils/passwordValidation.js";
import { authenticateToken } from "../middleware/auth.js";
import type { AuthRequest } from "../middleware/auth.js";

const router = express.Router();
const secret = process.env.JWT_SECRET;
const tokenExpiration = process.env.TOKEN_EXPIRATION || "1d";

if (!secret) {
  throw new Error("JWT_SECRET is required in environment variables");
}

router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: "Name, email and password are required" });
    }

    const pwdValidation = validatePassword(password);
    if (!pwdValidation.isValid) {
      return res.status(400).json({ error: pwdValidation.error });
    }

    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: "Email already registered" });
    }

    const totalUsers = await User.countDocuments();
    const role = totalUsers === 0 ? "admin" : "customer";
    const user = await User.createUser(name, email, password, role);

    const token = jwt.sign({ userId: user.id }, secret, {
      expiresIn: tokenExpiration as any,
    });

    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (error: any) {
    res.status(500).json({ error: "Failed to register user", details: error.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const validPassword = await user.comparePassword(password);
    if (!validPassword) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = jwt.sign({ userId: user.id }, secret, {
      expiresIn: tokenExpiration as any,
    });

    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (error: any) {
    res.status(500).json({ error: "Login failed", details: error.message });
  }
});

router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Email address is required" });
    }

    const user = await User.findByEmail(email);
    const successMsg = "If an account with that email exists, password reset instructions have been generated.";

    if (!user) {
      return res.json({ message: successMsg });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 3600000); // 1 hour expiration

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = expires;
    await user.save();

    console.log(`[AUTH] Password reset requested for ${user.email}. Token: ${resetToken}`);

    res.json({
      message: successMsg,
      resetToken,
      resetUrl: `/reset-password?token=${resetToken}`,
    });
  } catch (error: any) {
    res.status(500).json({ error: "Failed to process forgot password request", details: error.message });
  }
});

router.post("/reset-password", async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) {
      return res.status(400).json({ error: "Reset token and new password are required" });
    }

    const pwdValidation = validatePassword(newPassword);
    if (!pwdValidation.isValid) {
      return res.status(400).json({ error: pwdValidation.error });
    }

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() },
    });

    if (!user) {
      return res.status(400).json({ error: "Invalid or expired password reset token" });
    }

    const salt = await bcrypt.genSalt(10);
    user.passwordHash = await bcrypt.hash(newPassword, salt);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: "Password has been reset successfully. You can now log in with your new password." });
  } catch (error: any) {
    res.status(500).json({ error: "Failed to reset password", details: error.message });
  }
});

// ── Get Current Authenticated User ──────────────────────────────────────
router.get("/me", authenticateToken, async (req: AuthRequest, res) => {
  try {
    if (!req.user) return res.status(401).json({ error: "Unauthorized" });
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        provider: user.provider || "local",
        createdAt: user.createdAt,
      },
    });
  } catch (error: any) {
    res.status(500).json({ error: "Failed to fetch profile", details: error.message });
  }
});

// ── Update Profile (Name) ────────────────────────────────────────────────
router.put("/profile", authenticateToken, async (req: AuthRequest, res) => {
  try {
    if (!req.user) return res.status(401).json({ error: "Unauthorized" });
    const { name } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ error: "Name cannot be empty" });
    }

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    user.name = name.trim();
    await user.save();

    res.json({
      message: "Profile updated successfully",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        provider: user.provider || "local",
        createdAt: user.createdAt,
      },
    });
  } catch (error: any) {
    res.status(500).json({ error: "Failed to update profile", details: error.message });
  }
});

// ── Change Password ──────────────────────────────────────────────────────
router.put("/change-password", authenticateToken, async (req: AuthRequest, res) => {
  try {
    if (!req.user) return res.status(401).json({ error: "Unauthorized" });
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: "Current password and new password are required" });
    }

    const pwdValidation = validatePassword(newPassword);
    if (!pwdValidation.isValid) {
      return res.status(400).json({ error: pwdValidation.error });
    }

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    const isValid = await user.comparePassword(currentPassword);
    if (!isValid) {
      return res.status(400).json({ error: "Incorrect current password" });
    }

    const salt = await bcrypt.genSalt(10);
    user.passwordHash = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.json({ message: "Password changed successfully" });
  } catch (error: any) {
    res.status(500).json({ error: "Failed to change password", details: error.message });
  }
});

export default router;
