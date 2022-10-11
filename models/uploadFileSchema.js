import mongoose from "mongoose";

const uploadFileSchema = new mongoose.Schema({
    fileName: {
        type: String,
        required: true,
        unique: true,
    },
    path: {
        type: String,
        required: true,
    },
    workType: {           //entry or update
        type: String,
        required: true,
    },
    time: {
        Type: Number,
    },
    supplier: String,
    additionalDetails: {
        type: Object,
        _id: false,
    },
    assignDate: Date,
    assignToName: String,
    assignToDealAyoId: String,
    doneStatus: {
        type: Boolean,
        default: false,
    },
    doneByDealAyoId: String,
    doneByName: String,
    doneDate: Date,
    remarks: String,
})

export default mongoose.models.uploadedFile || mongoose.model('uploadedFile', uploadFileSchema); 