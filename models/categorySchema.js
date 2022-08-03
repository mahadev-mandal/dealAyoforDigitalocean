import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    category: {
        type: String,
        required: true,
        unique: true
    },
    time: {
        type: Number,
        required: true,
    }
})

export default mongoose.models.categories || mongoose.model('categories', categorySchema);