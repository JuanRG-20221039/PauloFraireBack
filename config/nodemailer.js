import nodemailer from 'nodemailer';
import dotvenv from 'dotenv';

dotvenv.config();

const config = () => {


    return {
        service: 'gmail',
        host:"",
        port: +"",
        secure: true,
        auth: {
            user: "",
            pass: ""
        }
    }
}

export const transporter = nodemailer.createTransport(config());