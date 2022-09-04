import tokenPayload from "../../../controllers/tokenPayload";
import db_conn from "../../../helpers/db_conn";
import attendaceModel from '../../../models/attendanceSchema';

db_conn();

export default function attend(req, res) {
    switch (req.method) {
        case "GET":
            return getAttendance(req, res);
        case "POST":
            return checkWorkEnded(req, res);
        default:
            res.status(405).send('Use proper method')
    }
}

async function getAttendance(req, res) {
    const { dateFrom, dateTo } = req.query;
    await attendaceModel.find({
        date: {
            "$gte": new Date(dateFrom),
            "$lt": new Date(dateTo)
        },
    }).sort({ date: -1 }).then((attendances) => {
        let data;
        if (tokenPayload(req.cookies.token).role === 'super-admin' || tokenPayload(req.cookies.token).role === 'admin') {
            //filter attendace with entryTime not null
            data = attendances.map((attendance) => {
                const employees = attendance.employees.filter(emp => emp.entryTime !== null);
                return { date: attendance.date, employees }
            })
        } else {
            // filter results with matching dealAyoid if not admin or super admin
            data = attendances.map((attendance) => {
                const employees = attendance.employees.filter(emp => emp.dealAyoId === tokenPayload(req.cookies.token).dealAyoId);
                return { date: attendance.date, employees }
            })
        }

        res.status(200).json(data)
    }).catch(() => {
        res.status(500).send('Error occured while fetching attendance details')
    })
}

const checkWorkEnded = async (req, res) => {
    await attendaceModel.findOne({
        date: {
            "$gte": new Date().setHours(0, 0, 0, 0),
            "$lt": new Date().setHours(24)
        },
        "employees.dealAyoId": tokenPayload(req.cookies.token).dealAyoId,
    }, { date: 1, "employees.$": 1 }).then((attendance) => {
        if (attendance) {
            if (attendance.employees[0].exitTime) {
                res.send(true)
            } else {
                res.send(false)
            }
        } else {
            res.send(false)
        }
    }).catch(() => {
        res.status(500).send("Error in checking work ended")
    })
}