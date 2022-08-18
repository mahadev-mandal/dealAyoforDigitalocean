import db_conn from "../../../helpers/db_conn";
import productModel from '../../../models/productSchema'

db_conn();

export default function Tasks(req, res) {
    switch (req.method) {
        case 'GET':
            return getAllAssignedTasks(req, res);
        default:
            res.status(500).send('Use proper methods')
    }
}

const getAllAssignedTasks = async (req, res) => {
    const { page, rowsPerPage } = req.query;
    await productModel.find({
        assignStatus: true,
        assignDate: {
            "$gte": new Date().setHours(0, 0, 0, 0),
            "$lt": new Date().setHours(24)
        }
    })
        .skip(parseInt(rowsPerPage) * parseInt(page))
        .limit(parseInt(rowsPerPage))
        .then((products) => {
            res.status(200).json(products)
        }).catch(() => {
            res.status(500).send('Error occured while fetching assigned tasks')
        })
}