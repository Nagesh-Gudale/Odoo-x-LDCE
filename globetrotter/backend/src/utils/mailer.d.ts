import nodemailer from "nodemailer";
export declare const mailer: nodemailer.Transporter<import("nodemailer/lib/smtp-transport/index.js").SentMessageInfo, import("nodemailer/lib/smtp-transport/index.js").Options>;
interface SendOtpArgs {
    to: string;
    otp: string;
    purpose: "signup_verify" | "login_mfa";
    ttlMinutes: number;
}
export declare function sendOtpEmail(args: SendOtpArgs): Promise<void>;
export {};
//# sourceMappingURL=mailer.d.ts.map