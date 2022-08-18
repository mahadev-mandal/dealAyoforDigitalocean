import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema({
    dealAyoId: {
        type: String,
        required: true,
        unique: true,
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
    },
    mobile: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    role: {
        type: String,
        required: true,
    },
    startTime: {
        type: String,
        required: true,
    },
    endTime: {
        type: String,
        required: true,
    },
    decreaseTask: {
        type: Number,
        required: true,
        default: 0,
    },
    password: {
        type: String,
        required: true
    },
    // status: {
    //     type: boolean,
    //     required: true,
    //     default: true
    // }
});
export default mongoose.models.employees || mongoose.model('employees', employeeSchema);
