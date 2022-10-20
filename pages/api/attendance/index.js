import db_conn from "../../../helpers/db_conn";
import attendaceModel from '../../../models/attendanceSchema';
import holidayModel from '../../../models/holidaysSchema';
import tokenPayload from '../../../controllers/tokenPayload'

db_conn();

export default function attend(req, res) {
    switch (req.method) {
        case "GET":
            return getAttendance(req, res);
        case "POST":
            return saveAttendance(req, res);
        case "PUT":
            return updateAttendance(req, res);
        default:
            res.status(405).send('Use proper method')
    }
}

async function getAttendance(req, res) {
    let DA;
    const { dealAyoId, page, rowsPerPage, dateFrom, dateTo } = req.query;
    if (!(tokenPayload(req.cookies.token).role == 'super-admin')) {
        DA = tokenPayload(req.cookies.token).dealAyoId
    } else {
        DA = dealAyoId
    }
    try {
        let query = {
            date: {
                "$gte": new Date(dateFrom),
                "$lt": new Date(dateTo)
            },
            "employees.dealAyoId": DA
        }

        const holidays = await holidayModel.find({
            date: {
                "$gte": new Date(dateFrom),
                "$lt": new Date(dateTo)
            },
        })

        var data = await attendaceModel.find(
            query,
            {
                date: 1,
                'employees.$': 1
            }
        ).skip(parseInt(rowsPerPage) * parseInt(page))
            .limit(parseInt(rowsPerPage))
            .sort({ date: -1 })

        var totalCount = await attendaceModel.countDocuments({
            "employees.dealAyoId": dealAyoId
        },
            {
                date: 1,
                'employees.$': 1
            });

        holidays.forEach((item) => {
            data.push({
                date: new Date(item.date).toLocaleDateString(),
                type: item.type,
                details: item.details,
                employees: [
                    {
                        dealAyoId: DA
                    }
                ]

            })
        })

        let l = new Date(dateFrom);
        const sunHolidayEmp = ['r11']
        while (l < new Date(dateTo)) {
            if (sunHolidayEmp.includes(DA)) {
                if (new Date(l).getDay() == 0) {
                    data.push({
                        date: new Date(l).toLocaleDateString(),
                        type: 'saturday',
                        details: 'Sunday',
                        employees: [
                            {
                                dealAyoId: DA
                            }
                        ]

                    })
                }
            }
            if (new Date(l).getDay() == 6) {
                data.push({
                    date: new Date(l).toLocaleDateString(),
                    type: 'saturday',
                    details: 'Saturday',
                    employees: [
                        {
                            dealAyoId: DA
                        }
                    ]

                })
            }
            let nd = l.setDate(l.getDate() + 1);
            l = new Date(nd)
        }
        if (DA == '') {
            data = [];
            totalCount=0;
        }
        res.status(200).json({ data: data.filter((d) => new Date(d.date) <= new Date()), totalCount })
    } catch (err) {
        res.status(500).send('Error occured while fetching attendance details')
    }

}

const saveAttendance = async (req, res) => {
    const attendances = req.body;
    try {
        await attendaceModel.insertMany(attendances);
        res.send('Saved sucessfully')
    } catch (err) {
        console.log(err);
        res.status(500).send('error  while saving attendance');
    }
}

const updateAttendance = async (req, res) => {
    try {
        await attendaceModel.updateOne(
            {
                date: req.body.date,
                "employees.dealAyoId": req.body.dealAyoId
            },
            {
                $set: {
                    "employees.$.entryTime": req.body.entryTime,
                    "employees.$.exitTime": req.body.exitTime,
                    "employees.$.worked": req.body.worked,
                    "employees.$.attendanceStatus": req.body.attendanceStatus
                }
            }
        )
        res.send('Saved');
    } catch (err) {
        console.log(err);
        res.status(500).send('error  while updating attendance');
    }
}