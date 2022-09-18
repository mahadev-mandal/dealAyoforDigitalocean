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
            attendanceStatus:String,
            entryTime: {
                type: Date,
            },
            exitTime: {
                type: Date,
            },
            late:String,
            earlyLeave:String,
            worked:String,
            breakTime:String,
            comment: String,
        }
    ]
})

export default mongoose.models.attendance || mongoose.model('attendance', attendanceSchema);