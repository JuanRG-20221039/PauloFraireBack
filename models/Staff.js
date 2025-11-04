import mongoose from 'mongoose';

const staffSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    position: {
        type: String,
        required: true,
        trim: true
    },
    photo: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

const Staff = mongoose.model('Staff', staffSchema);

export default Staff;