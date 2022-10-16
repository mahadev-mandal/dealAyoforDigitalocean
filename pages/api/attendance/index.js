import db_conn from "../../../helpers/db_conn";
import attendaceModel from '../../../models/attendanceSchema';
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
    const {  dealAyoId, page, rowsPerPage, dateFrom, dateTo } = req.query;
    try {
        let query = {
            date: {
                "$gte": new Date(dateFrom),
                "$lt": new Date(dateTo)
            },
            "employees.dealAyoId": dealAyoId
        }
        if (!(tokenPayload(req.cookies.token).role == 'super-admin')) {
            query = { ...query, "employees.dealAyoId": tokenPayload(req.cookies.token).dealAyoId }
        }

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

const updateAttendance = async (req, res) =>{
    try{
        await attendaceModel.updateOne(
            {
            date:req.body.date,
            "employees.dealAyoId":req.body.dealAyoId
        },
        {
            $set:{
                
            }
        }
        )
    }catch(err){
        console.log(err);
        res.status(500).send('error  while updating attendance');
    }
}