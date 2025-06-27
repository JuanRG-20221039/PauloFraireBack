import Notify from "../models/Notify.js";

// Obtener todas las notificaciones
const getNotifications = async (req, res) => {
    try {
        const notifications = await Notify.find().sort({ createdAt: -1 });
        
        // Verificar si alguna notificación ha expirado
        const ahora = new Date();
        for (const notification of notifications) {
            if (notification.estado === 'VIGENTE' && notification.fechaExpiracion <= ahora) {
                notification.estado = 'EXPIRADO';
                await notification.save();
            }
        }
        
        res.json(notifications);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};

// Obtener notificación por ID
const getNotificationById = async (req, res) => {
    const { id } = req.params;
    
    try {
        if (!id) {
            const error = new Error('ID requerido');
            return res.status(400).json({ message: error.message });
        }
        
        const notification = await Notify.findById(id);
        
        if (!notification) {
            const error = new Error('Notificación no encontrada');
            return res.status(404).json({ message: error.message });
        }
        
        // Verificar si la notificación ha expirado
        const ahora = new Date();
        if (notification.estado === 'VIGENTE' && notification.fechaExpiracion <= ahora) {
            notification.estado = 'EXPIRADO';
            await notification.save();
        }
        
        res.json(notification);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};

// Crear nueva notificación
const createNotification = async (req, res) => {
    const { titulo, resumen, descripcion, horaEmision, tiempoExpiracion, tipo, prioridad } = req.body;
    
    try {
        if (!titulo || !resumen || !descripcion || !horaEmision || !tiempoExpiracion || !tipo) {
            const error = new Error('Todos los campos son requeridos');
            return res.status(400).json({ message: error.message });
        }
        
        // Validar formato de hora
        const horaRegex = /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/;
        if (!horaRegex.test(horaEmision) || !horaRegex.test(tiempoExpiracion)) {
            const error = new Error('Formato de hora inválido. Debe ser HH:MM:SS');
            return res.status(400).json({ message: error.message });
        }
        
        const notification = new Notify({
            titulo,
            resumen,
            descripcion,
            horaEmision,
            tiempoExpiracion,
            tipo,
            prioridad,
            estado: 'VIGENTE'
        });
        
        const savedNotification = await notification.save();
        res.status(201).json(savedNotification);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};

// Actualizar notificación
const updateNotification = async (req, res) => {
    const { id } = req.params;
    const { titulo, resumen, descripcion, horaEmision, tiempoExpiracion, tipo, estado, prioridad } = req.body;
    
    try {
        if (!id) {
            const error = new Error('ID requerido');
            return res.status(400).json({ message: error.message });
        }
        
        const notification = await Notify.findById(id);
        
        if (!notification) {
            const error = new Error('Notificación no encontrada');
            return res.status(404).json({ message: error.message });
        }
        
        // Actualizar campos si se proporcionan
        notification.titulo = titulo || notification.titulo;
        notification.resumen = resumen || notification.resumen;
        notification.descripcion = descripcion || notification.descripcion;
        notification.tipo = tipo || notification.tipo;
        notification.prioridad = prioridad || notification.prioridad;
        
        // Si se actualiza la hora de emisión o tiempo de expiración, validar formato
        if (horaEmision || tiempoExpiracion) {
            const horaRegex = /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/;
            
            if (horaEmision) {
                if (!horaRegex.test(horaEmision)) {
                    const error = new Error('Formato de hora de emisión inválido. Debe ser HH:MM:SS');
                    return res.status(400).json({ message: error.message });
                }
                notification.horaEmision = horaEmision;
            }
            
            if (tiempoExpiracion) {
                if (!horaRegex.test(tiempoExpiracion)) {
                    const error = new Error('Formato de tiempo de expiración inválido. Debe ser HH:MM:SS');
                    return res.status(400).json({ message: error.message });
                }
                notification.tiempoExpiracion = tiempoExpiracion;
            }
        }
        
        // Actualizar estado si se proporciona
        if (estado) {
            if (estado !== 'VIGENTE' && estado !== 'EXPIRADO') {
                const error = new Error('Estado inválido. Debe ser VIGENTE o EXPIRADO');
                return res.status(400).json({ message: error.message });
            }
            notification.estado = estado;
        }
        
        const updatedNotification = await notification.save();
        res.json(updatedNotification);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};

// Eliminar notificación
const deleteNotification = async (req, res) => {
    const { id } = req.params;
    
    try {
        if (!id) {
            const error = new Error('ID requerido');
            return res.status(400).json({ message: error.message });
        }
        
        const notification = await Notify.findById(id);
        
        if (!notification) {
            const error = new Error('Notificación no encontrada');
            return res.status(404).json({ message: error.message });
        }
        
        await notification.deleteOne();
        res.json({ message: 'Notificación eliminada correctamente' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};

// Obtener notificaciones por tipo
const getNotificationsByType = async (req, res) => {
    const { tipo } = req.params;
    
    try {
        if (!tipo) {
            const error = new Error('Tipo requerido');
            return res.status(400).json({ message: error.message });
        }
        
        const notifications = await Notify.find({ tipo }).sort({ createdAt: -1 });
        
        // Verificar si alguna notificación ha expirado
        const ahora = new Date();
        for (const notification of notifications) {
            if (notification.estado === 'VIGENTE' && notification.fechaExpiracion <= ahora) {
                notification.estado = 'EXPIRADO';
                await notification.save();
            }
        }
        
        res.json(notifications);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};

// Obtener notificaciones por estado
const getNotificationsByStatus = async (req, res) => {
    const { estado } = req.params;
    
    try {
        if (!estado || (estado !== 'VIGENTE' && estado !== 'EXPIRADO')) {
            const error = new Error('Estado inválido. Debe ser VIGENTE o EXPIRADO');
            return res.status(400).json({ message: error.message });
        }
        
        // Actualizar estados antes de la consulta
        if (estado === 'VIGENTE') {
            const ahora = new Date();
            await Notify.updateMany(
                { estado: 'VIGENTE', fechaExpiracion: { $lte: ahora } },
                { $set: { estado: 'EXPIRADO' } }
            );
        }
        
        const notifications = await Notify.find({ estado }).sort({ createdAt: -1 });
        res.json(notifications);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};

export {
    getNotifications,
    getNotificationById,
    createNotification,
    updateNotification,
    deleteNotification,
    getNotificationsByType,
    getNotificationsByStatus
};