// import jwt from "jsonwebtoken";
import db_conn from "../../../helpers/db_conn";
import attendaceModel from '../../../models/attendanceSchema';

db_conn();

export default function attend(req, res) {
    switch (req.method) {
        case "POST":
            return getAttendance(req, res);
        case "PUT":
            return saveOrUpdateAttendance(req, res);
        default:
            res.status(404).send('Use proper method')

    }
}

async function getAttendance(req, res) {
    // const tokenDecoded = jwt.verify(req.body.token, process.env.SECRET_KEY, function (err, decoded) {
    //     if (err) {
    //         res.status(500).send('Error in token')
    //     } else {
    //         return decoded
    //     }
    // });
    await attendaceModel.find({
        date: {
            "$gte": new Date(req.body.dateFrom),
            "$lt": new Date(req.body.dateTo)
        },
    }).sort({ date: -1 })
        .then((attendences) => {
            res.status(200).json(attendences)
        }).catch(() => {
            res.status(500).send('Something went wrong')
        })
}
// { upsert: true, new: true, setDefaultsOnInsert: true }

//Attendance will be saved if no date found or will be updated if date found
const saveOrUpdateAttendance = async (req, res) => {
    await attendaceModel.find({
        date: {
            "$gte": new Date().setHours(0, 0, 0, 0),
            "$lt": new Date().setHours(24)
        }
    }).then((data) => {
        if (data.length > 0) {
            return updateAttendance(req, res, data);
        } else {
            return saveAttendance(req, res);
        }
    }).catch((err) => {
        res.json(err)
    })

}

//attence will be saved no date found
const saveAttendance = async (req, res) => {

    const attendance = new attendaceModel({
        date: new Date(req.body.date),
        employees: [
            {
                dealAyoId: req.body.dealAyoId,
                name: req.body.name,
                entryTime: req.body.entryTime,
                exitTime: req.body.exitTime,
                comment: req.body.comment,
            }
        ]
    })
    await attendance.save()
        .then(() => {
            res.status(200).send('Attendance saved sucessfully')
        }).catch((err) => {
            console.log(err)
            res.status(500).send('Error occured while saving attendance')
        })
}

//attendance will be updated (date found)
async function updateAttendance(req, res, data) {
    if (data[0].employees.find(e => e.dealAyoId === req.body.dealAyoId)) {
        //if empId found in date then attendance of emp is updated in object
        await attendaceModel.updateOne({
            date: {
                "$gte": new Date().setHours(0, 0, 0, 0),
                "$lt": new Date().setHours(24)
            },
            "employees.dealAyoId": req.body.dealAyoId
        }, {
            $set: {
                "employees.$.name": req.body.name,
                "employees.$.entryTime": req.body.entryTime,
                "employees.$.exitTime": req.body.exitTime,
                "employees.$.comment": req.body.comment,
            }
        }).then(() => {
            res.status(200).send('Attendance updated sucessfully')
        }).catch(() => {
            res.status(500).send('Error occured while updating attendance')
        })
    } else {
        //if empId not found in date, attendance with empId will be pushed to array
        await attendaceModel.updateOne({
            date: {
                "$gte": new Date().setHours(0, 0, 0, 0),
                "$lt": new Date().setHours(24)
            }
        }, {
            $push: {
                employees: {
                    dealAyoId: req.body.dealAyoId,
                    name: req.body.name,
                    entryTime: req.body.entryTime,
                    exitTime: req.body.exitTime,
                    comment: req.body.comment,
                }
            }
        }).then(() => {
            res.status(200).send('Attendance pushed to array');
        }).catch(() => {
            res.status(500).send('Error occured while pushing attendance to array');
        })
    }
}