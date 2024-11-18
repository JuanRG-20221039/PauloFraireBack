import SibApiV3Sdk from 'sib-api-v3-sdk'; // Importar el SDK de Brevo
import crypto from 'crypto';
import ValidateToken from '../models/ValidateToken.js'; // Asegúrate de tener tu modelo de token validado

// Usar una variable de entorno para la clave API (es más seguro)
const BREVO_API_KEY ='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'; // Deberías usar variables de entorno para la clave API

// Configuración de la API de Brevo (SendinBlue)
const defaultClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = BREVO_API_KEY;

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

// Ruta para crear y enviar el código de verificación al correo
export const createValidateToken = async (req, res) => {
    const { email } = req.body;

    // Validar que se proporcione el correo
    if (!email) {
        return res.status(400).json({ message: "Email is required" });
    }

    // Generar token y tiempo de expiración (5 minutos)
    const token = crypto.randomInt(100000, 999999).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutos de expiración

    try {
        // Limpiar tokens anteriores asociados al correo
        await ValidateToken.deleteMany({ email });

        // Crear y guardar un nuevo token
        const newToken = new ValidateToken({
            email,
            token,
            expiresAt,
            isValid: true,
        });

        await newToken.save();

        // Crear el correo a enviar
        const sendSmtpEmail = {
            sender: { email: "copomex65@gmail.com", name: "CRESPF" }, // Asegúrate de que este email esté verificado en Brevo
            to: [{ email }], // El destinatario
            subject: "Your Verification Code - CRESPF",
            htmlContent: `
                <p>Hello,</p>
                <p>Your verification code is: <strong>${token}</strong></p>
                <p>This code will expire in 5 minutes.</p>
                <p>Thank you,<br>CRESPF</p>
            `,
        };

        // Enviar el correo usando la API de Brevo
        await apiInstance.sendTransacEmail(sendSmtpEmail);

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