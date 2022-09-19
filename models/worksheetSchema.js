import mongoose from "mongoose";
import db_conn from "../helpers/db_conn";

db_conn();

const workSheet = new mongoose.Schema({
    date: {
        type: Date,
        required: true,
        unique: true,
    },
    employees: [
        {
            _id: false,
            dealAyoId: {
                type: String,
                required: true,
                unique:true,
            },
            name: {
                type: String
            },
            tasksCompleted: {
                type: Number,
                default: 0
            },
            comment: {
                type: String
            }
        }
    ]

})

export default mongoose.models.worksheet || mongoose.model('worksheet', workSheet);