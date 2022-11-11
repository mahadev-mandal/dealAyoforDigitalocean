import db_conn from "../../../helpers/db_conn";
import attendaceModel from '../../../models/attendanceSchema';
import holidayModel from '../../../models/holidaysSchema';
import tokenPayload from '../../../controllers/tokenPayload'
import getAllSat from "../../../controllers/getAllSat";

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
    const sunHolidayEmp = ['r11'];
    const friHolidayEmp = ['p11'];
    const { dealAyoId, dateFrom, dateTo } = req.query;
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

        let holidays = await holidayModel.find({
            date: {
                "$gte": new Date(dateFrom),
                "$lt": new Date(dateTo)
            },
        });
        //remove sunday holiday for employee not working sunday    
        if (sunHolidayEmp.includes(DA)) {
            holidays = holidays.filter(h => new Date(h.date).getDay() != 0)
        }
        //remove friday holiday for employee not working friday   
        if (friHolidayEmp.includes(DA)) {
            holidays = holidays.filter(h => new Date(h.date).getDay() != 5)
        }


        var data = await attendaceModel.find(
            query,
            {
                date: 1,
                'employees.$': 1
            }
        );
        let saturdays = getAllSat(dateFrom, data[data.length-1].date, DA);
        
        //push holiday to data
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

        if (DA == '') {
            data = [];
        }
        res.status(200).json({ data: [...data, ...saturdays], totalCount: data.length })
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