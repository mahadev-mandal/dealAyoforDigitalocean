import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true,
        unique: true,
        index: true,
    },
    employees: [
        {
            _id: false,
            dealAyoId: {
                type: String,
                required: true,
            },
            name: {
                type: String,
                required: true
            },
            attendanceStatus: String,
            entryTime: {
                type: String,
            },
            exitTime: {
                type: String,
            },
            late: String,
            earlyLeave: String,
            worked: String,
            breakTime: String,
            additionalDetails: Object,
        }
    ]
})

export default mongoose.models.attendance || mongoose.model('attendance', attendanceSchema);