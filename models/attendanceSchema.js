import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true,
        unique: true,
        index: true,
    },
    name: String,
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
            entryTime: {
                type: Date,
            },
            exitTime: {
                type: Date,
            },
            tasksAssigned: {
                type: Number,
                default: 0
            },
            tasksCompleted: {
                type: Number,
                default: 0,
            },
            extraTasksCompleted: {
                type: Number,
                default: 0
            },
            errors: {
                type: Number,
                default: 0,
            },
            comment: String,
        }
    ]
})

export default mongoose.models.attendance || mongoose.model('attendance', attendanceSchema);