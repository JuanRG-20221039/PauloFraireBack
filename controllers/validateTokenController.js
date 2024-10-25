import ValidateToken from "../models/ValidateToken.js";
import crypto from "crypto";
import nodemailer from "nodemailer";

const TOKEN_EXPIRY_TIME = 5 * 60 * 1000; // 5 minutos

export const createValidateToken = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: "Email is required" });
    }

    const token = crypto.randomInt(100000, 999999).toString();
    const expiresAt = new Date(Date.now() + TOKEN_EXPIRY_TIME);

    try {
        // Limpiar tokens anteriores si existen
        await ValidateToken.deleteMany({ email });

        const newToken = new ValidateToken({
            email,
            token,
            expiresAt,
            isValid: true,
        });

        await newToken.save();

        const transporter = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            auth: {
                user: 'gerry.dickens61@ethereal.email',
                pass: '2jA6MUFxhqR1cm1WWp',
            },
        });

        const mailOptions = {
            from: 'gerry.dickens61@ethereal.email',
            to: email,
            subject: 'Your Verification Code - Centro Regional de Educación Superior Paulo Freire',
            text: `Your verification code is: ${token}`,
        };

        await transporter.sendMail(mailOptions);

        res.status(201).json({ message: "Verification token created and sent" });
    } catch (error) {
        console.error("Error creating token:", error);
        res.status(500).json({ message: "Server error" });
    }
};

export const verifyValidateToken = async (req, res) => {
    const { email, token } = req.body;

    if (!email || !token) {
        return res.status(400).json({ message: "Email and token are required" });
    }

    try {
        const tokenDoc = await ValidateToken.findOne({ email, isValid: true });

        if (!tokenDoc || tokenDoc.expiresAt < new Date()) {
            return res.status(400).json({ message: "Token not found or expired" });
        }

        const isMatch = await tokenDoc.compareToken(token);

        if (!isMatch) {
            return res.status(400).json({ message: "Invalid token" });
        }

        tokenDoc.isValid = false; // Marcar como utilizado
        await tokenDoc.save();

        res.status(200).json({ message: "Token verified successfully" });
    } catch (error) {
        console.error("Error verifying token:", error);
        res.status(500).json({ message: "Server error" });
    }
};

export const deleteValidateToken = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: "Email is required" });
    }

    try {
        await ValidateToken.deleteMany({ email });
        res.status(200).json({ message: "Tokens deleted successfully" });
    } catch (error) {
        console.error("Error deleting tokens:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Función para eliminar todos los tokens relacionados con un correo
export const deleteTokensByEmail = async (req, res) => {
    const { email } = req.body;
    
    try {
      await ValidateToken.deleteMany({ email }); // Eliminar todos los tokens relacionados al correo
    return res.status(200).json({ message: 'Tokens eliminados correctamente.' });
    } catch (error) {
    return res.status(500).json({ message: 'Error al eliminar tokens', error });
    }
};  