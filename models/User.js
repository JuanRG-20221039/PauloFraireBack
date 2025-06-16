import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  old_passwords: {
    type: [String],
    default: []
  },
  role: {
    type: Number,
    required: true
  },
  loginAttempts: {
    type: Number,
    default: 0
  },
  lockUntil: {
    type: Date,
    default: null
  },
  docsAspirante: [
    {
      name: { type: String, required: true },
      url: { type: String, required: true },
      type: { type: String },
      uploadDate: { type: Date, default: Date.now }
    }
  ],
  docsStatus: {
    type: String,
    enum: ['pendiente', 'aprobado', 'rechazado'],
    default: 'pendiente'
  }
}, {
  timestamps: true
});

const User = mongoose.model('User', userSchema);

export default User;
