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

        const data = await attendaceModel.find(
            query,
            {
                date: 1,
                'employees.$': 1
            }
        ).skip(parseInt(rowsPerPage) * parseInt(page))
            .limit(parseInt(rowsPerPage))
            .sort({ date: -1 })

        const totalCount = await attendaceModel.countDocuments({
            "employees.dealAyoId": dealAyoId
        },
            {
                date: 1,
                'employees.$': 1
            });

        holidays.forEach((item) => {
            data.push({
                date: item.date,
                type:item.type,
                details:item.details,
                employees: [
                    {
                        dealAyoId: DA
                    }
                ]

            })
        })

        let l = new Date(dateFrom);
        while (l < new Date(dateTo)) {
            if (new Date(l).getDay() == 4) {
                data.push({
                    date: l,
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

        res.status(200).json({ data, totalCount })
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

                }
            }
        )
    } catch (err) {
        console.log(err);
        res.status(500).send('error  while updating attendance');
    }
}