//User.js
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
    required: true,
    default: 0
  },
  loginAttempts: {
    type: Number,
    default: 0
  },
  lockUntil: {
    type: Date,
    default: null
  },
  selectedEducationalOffer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'EducationalOffer',
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
    type: Number,
    enum: [0, 1],  // 0: pendiente, 1: aprobado
    default: 0
  }
}, {
  timestamps: true
});

const User = mongoose.model('User', userSchema);

export default User;
