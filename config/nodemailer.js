import nodemailer from 'nodemailer';
import dotvenv from 'dotenv';

dotvenv.config();

const config = () => {


    return {
        service: 'gmail',
        host: process.env.SMTP_HOST,
        port: +process.env.SMTP_PORT,
        secure: true,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    }
}

export const transporter = nodemailer.createTransport(config());