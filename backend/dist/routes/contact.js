import express from "express";
import nodemailer from "nodemailer";
import Feedback from "../models/Feedback.js";
import { authenticateToken, requireAdmin } from "../middleware/auth.js";
const router = express.Router();
const TARGET_EMAIL = process.env.TARGET_EMAIL || "volonterwicha123@gmail.com";
// Helper function to create Nodemailer transporter
async function createTransporter() {
    const smtpUser = process.env.SMTP_USER || process.env.GMAIL_USER;
    const smtpPass = process.env.SMTP_PASS || process.env.GMAIL_APP_PASSWORD;
    if (smtpUser && smtpPass) {
        return nodemailer.createTransport({
            service: process.env.SMTP_SERVICE || "gmail",
            auth: {
                user: smtpUser,
                pass: smtpPass,
            },
        });
    }
    // Fallback to ethereal test account for local development
    try {
        const testAccount = await nodemailer.createTestAccount();
        return nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            secure: false,
            auth: {
                user: testAccount.user,
                pass: testAccount.pass,
            },
        });
    }
    catch {
        return null;
    }
}
// POST /api/contact - Submit contact message / feedback
router.post("/", async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;
        if (!name || !email || !message) {
            return res.status(400).json({ error: "Name, email, and message are required." });
        }
        // Save to Database
        const feedbackDoc = await Feedback.create({
            name,
            email,
            subject: subject || "General Inquiry",
            message,
        });
        const emailSubject = `[Artisan Crumbs Feedback] ${subject || "New Message"} from ${name}`;
        const emailText = `New Feedback / Contact Message received:

From: ${name} (${email})
Subject: ${subject || "General Inquiry"}
Submitted Date: ${new Date().toLocaleString()}

Message:
${message}
`;
        const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #fcfbf9;">
        <h2 style="color: #D46211; font-family: Georgia, serif; margin-top: 0;">Artisan Crumbs - New Customer Feedback</h2>
        <p><strong>From:</strong> ${name} (&lt;<a href="mailto:${email}">${email}</a>&gt;)</p>
        <p><strong>Subject:</strong> ${subject || "General Inquiry"}</p>
        <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 16px 0;" />
        <p style="white-space: pre-wrap; font-size: 14px; line-height: 1.6; color: #334155;">${message}</p>
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 16px 0;" />
        <p style="font-size: 12px; color: #94a3b8;">This message was submitted via the Artisan Crumbs website contact form and routed to ${TARGET_EMAIL}.</p>
      </div>
    `;
        console.log(`\n======================================================`);
        console.log(`[CONTACT EMAIL] Sending message to: ${TARGET_EMAIL}`);
        console.log(`Sender: ${name} <${email}>`);
        console.log(`Subject: ${emailSubject}`);
        console.log(`Message: ${message}`);
        console.log(`======================================================\n`);
        // Dispatch email
        const transporter = await createTransporter();
        if (transporter) {
            try {
                const info = await transporter.sendMail({
                    from: `"Artisan Crumbs Contact" <${process.env.SMTP_USER || email}>`,
                    to: TARGET_EMAIL,
                    replyTo: email,
                    subject: emailSubject,
                    text: emailText,
                    html: emailHtml,
                });
                const previewUrl = nodemailer.getTestMessageUrl(info);
                if (previewUrl) {
                    console.log(`[CONTACT EMAIL] Test Email Preview URL: ${previewUrl}`);
                }
            }
            catch (mailErr) {
                console.error("[CONTACT EMAIL] Failed to send email via SMTP:", mailErr.message);
            }
        }
        res.status(201).json({
            success: true,
            message: `Thank you! Your feedback has been sent to ${TARGET_EMAIL}.`,
            feedback: feedbackDoc,
        });
    }
    catch (error) {
        res.status(500).json({ error: "Failed to process feedback", details: error.message });
    }
});
// GET /api/contact - Admin route to view all feedback messages
router.get("/", authenticateToken, requireAdmin, async (_req, res) => {
    try {
        const messages = await Feedback.find().sort({ createdAt: -1 });
        res.json(messages);
    }
    catch (error) {
        res.status(500).json({ error: "Failed to retrieve feedback messages", details: error.message });
    }
});
export default router;
