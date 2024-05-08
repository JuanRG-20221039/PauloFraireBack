import mongoose from "mongoose";

const academyActivitiesSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
});

const AcademyActivities = mongoose.model("AcademyActivities", academyActivitiesSchema);

export default AcademyActivities;