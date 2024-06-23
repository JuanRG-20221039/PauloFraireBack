import nodemailer from 'nodemailer';

export const sendEmail = async (options) => {

    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    await transport.sendMail({
        from: '"Centro REGIONAL DE EDUCACIÓN SUPERIOR PAULO FREIRE" ',
        to: process.env.EMAIL_USER,
        subject: "Contactato desde la pagina web",
        text: "Formulario de contacto",
        html: `<p>Hola: El usuario ${options.email} 
        se ha comunicado contigo desde la pagina web,
         </p>
        
        <p> El mensaje es: ${options.message} </p>

        `,
    });

};