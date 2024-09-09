import { Router } from 'express';
import { sendEmail } from '../helpers/sendEmail.js';

const router = Router();

router.post('/contact', async (req, res) => {
    const { email, message } = req.body;

    try {
        if (!email || !message) {
            const error = new Error('Email y mensaje son requeridos');
            return res.status(400).json({ message: error.message });
        }

        await sendEmail({ email, message });

        res.send('Email enviado Correctamente');

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error sending email' })
    }
});

export default router;