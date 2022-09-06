import db_conn from "../../../helpers/db_conn";
import productModel from '../../../models/productSchema'

db_conn();

export default function Tasks(req, res) {
    switch (req.method) {
        case 'GET':
            return getAllAssignedTasks(req, res);
        case 'POST':
            return unAssignTasks(req, res);
        default:
            res.status(500).send('Use proper methods')
    }
}

const getAllAssignedTasks = async (req, res) => {
    // const { page, rowsPerPage } = req.query;
    await productModel.find({
        assignDate: {
            "$gte": new Date().setDate(1),
            "$lt": new Date().setHours(24)
        },
    })

        .then((products) => {
            res.status(200).json(products)
        }).catch(() => {
            res.status(500).send('Error occured while fetching assigned tasks')
        })
}

const unAssignTasks = async (req, res) => {
    try {
        const unassignedTasks = await productModel.updateMany({ _id: req.body.selected }, {
            $unset: {
                assignDate: '',
                assignToDealAyoId: '',
                assignToName: '',
                tasksId: ''
            }
        }, { new: true })

        res.send(unassignedTasks);
    } catch (err) {
        console.log(err);
        res.status(500).send('Error occured while unassigning tasks')
    }
}