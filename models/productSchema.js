import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    code: {
        type: String,
    },
    model: {
        type: String,
    },
    brand: {
        type: String,
    },
    weight: {
        type: String,
    },
    vendor: {
        type: String,
        required: true,
    },
    MRP: {
        type: Number,
    },
    SP: {
        type: Number,
    },
    discount: {
        type: Number,
    },
    quantity: {
        type: Number,
    },
    category: {
        type: String,
        required: true,
    },
    additionalDetails: {
        type: Object,
        _id: false,
    },
    entryDate: {
        type: String,
    },
    entryBy: {
        type: String,
    },
    lastUpdateDetails: {
        //date, name, updated fields like MRP:500 etc
        type: Object,  
        _id: false,
    },
    status: {
        type: Boolean,
        required: true,
    },
    entryStatus: {
        type: Boolean,
        required: true,
    },
})
export default mongoose.models.product || mongoose.model('product', productSchema);