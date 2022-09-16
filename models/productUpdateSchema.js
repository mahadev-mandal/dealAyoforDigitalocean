import mongoose from "mongoose";

const productUpdateSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    model: {
        type: String,
        // required: true,
    },
    oldPrice: {
        type: Number
    },
    updatedPrice: {
        type: String,
    },
    availability: {
        type: String,
    },
    additionalDetails: {
        type: Object,
        _id: false,
    },
    assignDate: {
        type: Date
    },
    assignToName: {
        type: String,
    },
    assignToDealAyoId: {
        type: String
    },
    updateDate: {
        type: Date
    },
    updateStatus: {
        type: Boolean,
        required: true,
        default: false,
    },
    updateByName: {
        type: String,
    },
    updateByDealAyoId: {
        type: String,
    },
    errorTask: {
        type: Boolean,
        required: true,
        default: false
    },
    remarks: {
        type: String,
    },
})

export default mongoose.models.productsUpdate || mongoose.model('productsUpdate', productUpdateSchema);