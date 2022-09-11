import db_conn from "../../../helpers/db_conn";
import productModel from '../../../models/productSchema'
import tasksModel from '../../../models/tasksSchema'
import tokenPayload from '../../../controllers/tokenPayload'

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
    const { dateFrom, dateTo, assignToEmp } = req.query;
    let query = {};
    if (Object.keys(req.query).length > 0) {
        query = {
            date: {
                "$gte": new Date(dateFrom),
                "$lt": new Date(dateTo),
            },
            assignToDealAyoId: tokenPayload(req.cookies.token).dealAyoId,
        }

    }
    if (tokenPayload(req.cookies.token).role === 'super-admin') {
        if (!assignToEmp == '') {
            query.assignToDealAyoId = assignToEmp
        } else {
            delete query['assignToDealAyoId'];
        }
    }
    
    await tasksModel.find(query)
        .then((data) => {
            res.status(200).json({ data })
        }).catch((e) => {
            console.log(e)
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