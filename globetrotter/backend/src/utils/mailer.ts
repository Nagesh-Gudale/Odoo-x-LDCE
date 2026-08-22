import nodemailer from "nodemailer";
import { env } from "../config/env.js";

// One reusable Gmail transport. Uses Nodemailer's built-in `service: 'gmail'`
// shorthand instead of manual host/port — Google still requires an App Password
// for SMTP auth (regular account passwords were disabled years ago). Generate one
// at https://myaccount.google.com/apppasswords (requires 2FA on the account).
export const mailer = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: env.GMAIL_USER,
    pass: env.GMAIL_APP_PASSWORD,
  },
});

interface SendOtpArgs {
  to: string;
  otp: string;
  purpose: "signup_verify" | "login_mfa";
  ttlMinutes: number;
}

// Single entry point used by both signup + login flows. Keeps the email copy
// consistent (same subject + body shape) and lets us swap providers later
// without touching controllers.
export async function sendOtpEmail(args: SendOtpArgs): Promise<void> {
  const { to, otp, purpose, ttlMinutes } = args;
  const subject =
    purpose === "signup_verify"
      ? "Verify your GlobeTrotter email"
      : "Your GlobeTrotter sign-in code";

  const text =
    `Your GlobeTrotter verification code is: ${otp}\n\n` +
    `This code expires in ${ttlMinutes} minutes. ` +
    `If you didn't request this, you can ignore the email.`;

  await mailer.sendMail({
    from: `"GlobeTrotter" <${env.GMAIL_USER}>`,
    to,
    subject,
    text,
  });
}
