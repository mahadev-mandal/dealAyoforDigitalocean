import db_conn from "../../../helpers/db_conn";
import attendaceModel from '../../../models/attendanceSchema';

db_conn();

export default function attend(req, res) {
    switch (req.method) {
        case "GET":
            return getAttendance(req, res);
        case "POST":
            return saveAttendance(req, res);
        default:
            res.status(405).send('Use proper method')
    }
}

async function getAttendance(req, res) {
    // const { dateFrom, dateTo } = req.query;
    try {
        const data = await attendaceModel.find({
            // date: {
            //     "$gte": new Date(dateFrom),
            //     "$lt": new Date(dateTo)
            // },
        }).sort({ date: -1 })

        const totalCount = await attendaceModel.estimatedDocumentCount();

        res.status(200).json({ data, totalCount })
    } catch (err) {
        res.status(500).send('Error occured while fetching attendance details')
    }

}

const saveAttendance = async (req, res) => {
    const attendances = req.body;
    try {
        const result = await attendaceModel.insertMany(attendances);
        console.log(result)
        res.send('Saved sucessfully')
    } catch (err) {
        console.log(err);
        res.status(500).send('error  while saving attendance');
    }
}