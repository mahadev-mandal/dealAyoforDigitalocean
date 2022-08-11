import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    code: {
        type: String,
    },
    title: {
        type:String,
        required: true
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
    lastUpdateDetails: {
        //date, name, updated fields like MRP:500 etc
        type: Object,  
        _id: false,
    },
    status: {
        type: Boolean,
        required: true,
        default: true,
    },
    entryStatus: {
        type: Boolean,
        required: true,
        default: false
    },
    entryDate: {
        type: Date,
    },
    entryBy: {
        type: String,
    },
    assignDate: {
        type: Date,
    },
    assignTo:{
        type: String,
    }
})
export default mongoose.models.product || mongoose.model('product', productSchema); 