import db_conn from "../../../helpers/db_conn";
import productModel from '../../../models/productSchema'
import tasksModel from '../../../models/tasksSchema'
import tokenPayload from '../../../controllers/tokenPayload'
import fileTaskModel from '../../../models/fileTasksSchema';

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
    const { dateFrom, dateTo, dealAyoId } = req.query;
    let query = {};
    try {
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
            if (!dealAyoId == '') {
                query.assignToDealAyoId = dealAyoId
            } else {
                delete query['assignToDealAyoId'];
            }
        }
        const tasks = await tasksModel.find(query);
        const fileTasks = await fileTaskModel.find(query);
        res.json({ data: tasks, fileTasks })
    } catch (err) {
        res.status(500).send('Error while fetching tasks')
    }
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