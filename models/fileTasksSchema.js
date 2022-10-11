import mongoose from "mongoose";
import db_conn from "../helpers/db_conn";

db_conn();

const fileTasksSchema = new mongoose.Schema({
    taskId: {
        type: Number,
        required: true,
        unique: true
    },
    date: {
        type: Date,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    time:{
        type:Number,
    },
    assignToDealAyoId: String,
    assignToName: String,
    comment: String,
    tasks: [
        {
            _id: false,
            tid: {
                type: String,
                required: true,
            },
            totalTasks:{
                type:Number,
            },
            completed: {
                type: Number,
            },
            errors: {
                type: Number,
            },
            status: {
                type: Boolean,
                required: true,
                default: true
            }
        }
    ]
})

export default mongoose.models.fileTasks || mongoose.model('fileTasks', fileTasksSchema);