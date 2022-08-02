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

const getAllAssignedTasks = async(req, res) => {
    await productModel.find()  //sort assigned is true
    .then((products)=>{
        res.status(200).json(products)
    }).catch(()=>{
        res.status(500).send('Error occured while fetching assigned tasks')
    })
}