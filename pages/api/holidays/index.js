import db_conn from '../../../helpers/db_conn';
import holidayModel from '../../../models/holidaysSchema';

db_conn()

export default function Holidays(req, res) {
    switch (req.method) {
        case 'POST':
            return addHoliday(req, res);
        case 'GET':
            return getHolidays(req, res);
        default:
            res.status(404).send('use proper method')
    }
}

const addHoliday = async (req, res) => {
    try {
        const newHoliday = new holidayModel({
            date: req.body.date,
            type: req.body.type,
            details: req.body.details
        })
        await newHoliday.save();
        res.send('holiday saved');
    } catch (err) {
        console.log(err)
        res.status(500).send("error while saving holiday");
    }

}

const getHolidays = async (req, res) => {
    try {
        const holidays = await holidayModel.find();
        res.json(holidays);
    } catch (err) {
        res.status(500).send("Error while getting holidays")
    }
}