import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema({
    date: {
        type: Number,
        required: true,
        unique:true,
        // index:true,
    },
    name:String,
    employees: [
        {
            _id:false,
            empId: {
                type: String,
                required: true,
            },
            name:{
                type: String,
                required: true
            },
            entryTime: {
                type: String,
            },
            exitTime: {
                type:String,
            },
            comment: String,   
        }
    ]
})

export default mongoose.models.attendance || mongoose.model('attendance', attendanceSchema);