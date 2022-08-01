import mongoose from 'mongoose';

export default function db_conn() {
    if (mongoose.connections[0].readyState) {
        console.log("Alrady connected")
    } else {
        mongoose.connect('mongodb://localhost:27017/dealAyo', {
            useNewUrlParser: true
        })
        mongoose.connection.on("connected", () => {
            console.log('connection sucessfully stablished')
        })
        mongoose.connection.on("error", (err) => {
            console.log("Error connecting to database", err)
        })
    }
}