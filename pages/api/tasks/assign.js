import db_conn from "../../../helpers/db_conn";
import productModel from '../../../models/productSchema'

db_conn();

export default function Tasks(req, res) {
    switch (req.method) {
        case 'POST':
            return AssignTasks(req, res);
        default:
            res.status(500).send('Use proper methods')
    }
}

const AssignTasks = async (req, res) => {
    console.log(req.body);
    try {
        const assignedTasks = await productModel.updateMany({ _id: req.body.selected }, {
            $set: {
                assignDate: req.body.assignDate,
                assignToDealAyoId: req.body.dealAyoId,
                assignToName: req.body.name
            }
        }, { new: true })
        // console.log(assignedTasks);
        res.send(assignedTasks);
    } catch (err) {
        console.log(err);
        res.status(500).send('Error occured while unassigning tasks')
    }
}