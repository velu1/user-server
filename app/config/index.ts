import dotenv from "dotenv";
dotenv.config();

export const config = {
  server: {
    ipAddress: process.env.IP_ADDRESS as string,
    users: Number(process.env.USRES__DEFAULT_PORT),
    // userSocket: 8121,
  },
  email: {
    FROM_EMAIL: process.env.FROM_EMAIL,
    REPLY_EMAIL: process.env.REPLY_EMAIL,
    SMTP_HOST: process.env.SMTP_HOST,
    SMTP_PORT: Number(process.env.SMTP_PORT),
    SMTP_USERNAME: process.env.SMTP_USERNAME,
    SMTP_PASSWORD: process.env.SMTP_PASSWORD,
    MAIL_SERVICE: process.env.MAIL_SERVICE,
  },
};
