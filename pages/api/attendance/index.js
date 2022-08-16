import jwt from "jsonwebtoken";
import db_conn from "../../../helpers/db_conn";
import attendaceModel from '../../../models/attendanceSchema';

db_conn();

export default function attend(req, res) {
    switch (req.method) {
        case "POST":
            return getAttendance(req, res);
        default:
            res.status(404).send('Use proper method')

    }
}

async function getAttendance(req, res) {
    const tokenDecoded = jwt.verify(req.body.token, process.env.SECRET_KEY, function (err, decoded) {
        if (err) {
            res.status(500).send('Error in token')
        } else {
            return decoded
        }
    });
    if (tokenDecoded.role === 'super-admin' || tokenDecoded.role === 'admin') {
        await attendaceModel.find({
            date: {
                "$gte": new Date(req.body.dateFrom),
                "$lt": new Date(req.body.dateTo)
            },
            "employees.dealAyoId": 'e11'
        }).sort({ date: -1 })
            .then((attendances) => {
                const data = attendances.map((attendance) => {
                    const employees = attendance.employees.filter(emp => emp.entryTime !== null);
                    return { date: attendance.date, employees }
                })
                res.status(200).json(data)
            }).catch(() => {
                res.status(500).send('Something went wrong')
            })
    } else {
        await attendaceModel.find({
            date: {
                "$gte": new Date(req.body.dateFrom),
                "$lt": new Date(req.body.dateTo)
            },
            "employees.dealAyoId": tokenDecoded.dealAyoId,
        }).sort({ date: -1 })
            .then((attendances) => {
                const data = attendances.map((attendance) => {
                    const employees = attendance.employees.filter(emp => emp.dealAyoId === tokenDecoded.dealAyoId);
                    return { date: attendance.date, employees }
                })
                res.status(200).json(data)
            }).catch(() => {
                res.status(500).send('Something went wrong')
            })
    }
}

// { upsert: true, new: true, setDefaultsOnInsert: true }

//Attendance will be saved if no date found or will be updated if date found
