import mongoose from "mongoose";
import db_conn from "../helpers/db_conn";

db_conn();

const tasksSchema = new mongoose.Schema({
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
            entryStatus: {
                type: Boolean,
                required: true
            },
            errorTask: {
                type: Boolean,
                required: true
            },
            status: {
                type: Boolean,
                required: true,
                default: true
            }
        }
    ]
})

export default mongoose.models.tasks || mongoose.model('tasks', tasksSchema);