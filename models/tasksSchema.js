import mongoose from "mongoose";
import db_conn from "../helpers/db_conn";

db_conn();

const tasksSchema = new mongoose.Schema({
    taskId:{
        type:Number,
        required:true,
        default:1,
    },
    dealAyoId:String,
    name:String,
    date:{
        type:Date,
        required:true
    }
})