import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    date: {
        type: String,
        required: true,
    },
    img: {
        type: String,
        required: true,
    },
    public_id: {
        type: String,
    },

}, {
    timestamps: true,
});



const Blog = mongoose.model("Blog", blogSchema);

export default Blog;