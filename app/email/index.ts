import { config } from "../config/index";

interface MailService {
  sendMail: (options: {
    to: string | string[];
    subject: string;
    body: string;
    cc?: string | string[];
    bcc?: string | string[];
    replyTo?: string;
    attachments?: { filename: string; path: string }[];
  }) => Promise<{ success: boolean; messageID: string }>;
}

export async function getMailService(): Promise<MailService> {
  const mailService = config.email.MAIL_SERVICE;

  let MailService: MailService;

  if (mailService === "Nodemailer") {
    MailService = await import("./nodemailer");
  } else {
    throw new Error("Mail service not supported");
  }

  return MailService;
}
