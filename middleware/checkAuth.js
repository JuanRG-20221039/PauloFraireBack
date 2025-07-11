import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const checkAuth = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        try {
            token = req.headers.authorization.split(" ")[1];

            const decoded = jwt.verify(token, "asdASDqweQWE123");

            req.usuario = await User.findById(decoded.id).select(
                "-password -confirmado -token -createdAt -updatedAt -__v"
            );

            if (!req.usuario) {
                return res.status(401).json({ msg: "Usuario no encontrado" });
            }

            return next();
        } catch (error) {
            return res.status(401).json({ msg: "Token inválido o expirado" });
        }
    }

    if (!token) {
        return res.status(401).json({ msg: "Token no válido" });
    }
};

const isAdmin = async (req, res, next) => {
    if (!req.usuario) {
        return res.status(401).json({ msg: "Usuario no autenticado" });
    }

    // Cambiar la condición de acceso para permitir roles 1 (admin) y 2 (editor)
    if (req.usuario.role !== 1 && req.usuario.role !== 2) {
        return res.status(403).json({ msg: "Acceso No Autorizado" });
    }

    next();
};


export { checkAuth, isAdmin };
