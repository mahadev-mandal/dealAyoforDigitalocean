import db_conn from "../../../helpers/db_conn";
import attendaceModel from '../../../models/attendanceSchema';

db_conn();

export default function attendance(req, res) {
    switch (req.method) {
        case 'PUT':
            return saveAttendance(req, res);
        default:
            res.status(404).send('User proper method');
    }
}

const saveAttendance = async (req, res) => {
    // const { empid } = req.query;
    const date = new Date()
    res.json(Date.parse("12:00 AM"))
    
    // const year = 2022;
    // const month = 8;
    // const day = 2;
    // const entryTime = 10;
    // const exitTime = 15;
    // await attendaceModel.updateOne({ _id: empid, date: req.body.date }, {
    //     $set: {
    //         empObjId: empid,
    //         date: req.body.date,
    //         name: req.body.name,
    //         [`status.${day}`]: {
    //             entryTime,
    //             exitTime,
    //         }
    //     }
    // }).then(() => {
    //     res.status(200).send('Attendance Updated');
    // }).catch(() => {
    //     res.status(500).send('Something went wrong')
    // })
}