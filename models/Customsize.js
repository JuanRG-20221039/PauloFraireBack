import mongoose from "mongoose";

const customsizeSchema = new mongoose.Schema({
    slideImg: {
        type: String
    },
    public_id: {
        type: String
    }

}, {
    timestamps: true
})

const Customsize = mongoose.model("Customsize", customsizeSchema);
export default Customsize;