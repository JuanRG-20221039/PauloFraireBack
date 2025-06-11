import mongoose from "mongoose";

const notifySchema = new mongoose.Schema({
    titulo: {
        type: String,
        required: true,
        trim: true
    },
    resumen: {
        type: String,
        required: true,
        trim: true
    },
    descripcion: {
        type: String,
        required: true,
        trim: true
    },
    horaEmision: {
        type: String,
        required: true,
        validate: {
            validator: function(v) {
                return /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/.test(v);
            },
            message: props => `${props.value} no es un formato de hora válido (HH:MM:SS)`
        }
    },
    tiempoExpiracion: {
        type: String,
        required: true,
        validate: {
            validator: function(v) {
                return /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/.test(v);
            },
            message: props => `${props.value} no es un formato de hora válido (HH:MM:SS)`
        }
    },
    estado: {
        type: String,
        enum: ['VIGENTE', 'EXPIRADO'],
        default: 'VIGENTE'
    },
    tipo: {
        type: String,
        required: true,
        trim: true
    },
    fechaExpiracion: {
        type: Date
    }
}, {
    timestamps: true
});

// Middleware para calcular la fecha de expiración antes de guardar
notifySchema.pre('save', function(next) {
    if (this.isModified('horaEmision') || this.isModified('tiempoExpiracion') || this.isNew) {
        // Convertir tiempoExpiracion de formato HH:MM:SS a milisegundos
        const [hours, minutes, seconds] = this.tiempoExpiracion.split(':').map(Number);
        const expiracionMs = (hours * 60 * 60 + minutes * 60 + seconds) * 1000;
        
        // Establecer la fecha de expiración
        const ahora = new Date();
        this.fechaExpiracion = new Date(ahora.getTime() + expiracionMs);
    }
    next();
});

const Notify = mongoose.model("Notify", notifySchema);

export default Notify;