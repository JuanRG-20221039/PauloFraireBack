import mongoose from "mongoose";

const ImageActivitySchema = new mongoose.Schema({
    description: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    public_id: {
        type: String,
        required: true
    },
    academyActivity: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AcademyActivities',
        required: true
    }

}, {
    timestamps: true
})

const ImageActivity = mongoose.model('ImageActivity', ImageActivitySchema);

export default ImageActivity