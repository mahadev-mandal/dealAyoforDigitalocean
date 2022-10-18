import mongoose from "mongoose";

const holidaysSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true,
        unique: true,
    },
    type: {
        type: String,
        required: true,
    },
    details: {
        type: String
    }
})
export default mongoose.models.holiday || mongoose.model('holiday', holidaysSchema);