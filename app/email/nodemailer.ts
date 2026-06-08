import { config } from "../config/index";
import nodemailer from "nodemailer";

export async function sendMail({
  to,
  subject,
  body,
  cc,
  bcc,
  replyTo,
  attachments,
}: {
  to: string | string[];
  subject: string;
  body: string;
  cc?: string | string[];
  bcc?: string | string[];
  replyTo?: string;
  attachments?: { filename: string; path: string }[];
}): Promise<{ success: boolean; messageID: string }> {
  try {
    const transporter = nodemailer.createTransport({
      host: config.email.SMTP_HOST,
      port: config.email.SMTP_PORT,
      secure: true,
      auth: {
        user: config.email.SMTP_USERNAME,
        pass: config.email.SMTP_PASSWORD,
      },
    });

    const mailOptions = {
      from: `DigiTrac <${config.email.FROM_EMAIL}>`,
      to,
      subject,
      html: body,
      cc,
      bcc,
      replyTo,
      attachments,
    };

    const info = await transporter.sendMail(mailOptions);
    return { success: true, messageID: info.messageId };
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
}
