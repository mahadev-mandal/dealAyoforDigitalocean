import db_conn from "../../../helpers/db_conn";
import attendaceModel from '../../../models/attendanceSchema';

db_conn();

export default function attend(req, res) {
    switch (req.method) {
        case "GET":
            return getAttendance(req, res);
        case "POST":
            return saveOrUpdateAttendance(req, res);
        default:
            res.status(404).send('Use proper method')

    }
}

async function getAttendance(req, res) {
    await attendaceModel.find({ date: req.body.date })
        .then((attendences) => {
            res.status(200).json(attendences)
        }).catch(() => {
            res.status(500).send('Something went wrong')
        })
}

// { upsert: true, new: true, setDefaultsOnInsert: true }

//Attendance will be saved if no date found or will be updated if date found
const saveOrUpdateAttendance = async (req, res) => {
    await attendaceModel.find({ date: req.body.date })
        .then((data) => {
            if (data.length > 0) {
                return updateAttendance(req, res, data);
            } else {
                return saveAttendance(req, res);
            }
        }).catch((err) => {
            res.json(err)
        })

}

const saveAttendance = async (req, res) => {
    const attendance = new attendaceModel({
        date: req.body.date,
        employees: [
            {
                empId: req.body.empId,
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
        }).catch(() => {
            res.status(500).send('Error occured while saving attendance')
        })
}

async function updateAttendance(req, res, data) {
    if (data[0].employees[0].empId === req.body.empId) {
        //if empId found in date then attendance of emp is updated in object
        await attendaceModel.updateOne({ date: req.body.date, "employees.empId": req.body.empId }, {
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
        await attendaceModel.updateOne({ date: req.body.date }, {
            $push: {
                employees: {
                    empId: req.body.empId,
                    name: req.body.name,
                    entryTime: req.body.startTime,
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