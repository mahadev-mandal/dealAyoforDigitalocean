import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    title: {
        type: String,
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
    assignToDealAyoId: {
        type: String,
    },
    assignToName: String,
    level: {
        type: Number,
        required: true,
        default: 1
    },
    errorTask: {
        type: Boolean,
        required: true,
        default: false
    },
    remarks: {
        type: String,
    },
    imageUrls:{
        type:Array
    }

})
export default mongoose.models.product || mongoose.model('product', productSchema); 