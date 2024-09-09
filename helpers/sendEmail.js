
import { transporter } from '../config/nodemailer.js';

export const sendEmail = async (options) => {

    await transporter.sendMail({
        from: '"Centro REGIONAL DE EDUCACIÓN SUPERIOR PAULO FREIRE" ',
        to: process.env.SMTP_USER,
        subject: "Contactato desde la pagina web",
        text: "Formulario de contacto",
        html: `<p>Hola: El usuario ${options.email} 
        se ha comunicado contigo desde la pagina web,
         </p>
        
        <p> El mensaje es: ${options.message} </p>

        `,
    });

};