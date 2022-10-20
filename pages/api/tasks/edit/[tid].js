import db_conn from "../../../../helpers/db_conn";
import productModel from '../../../../models/productSchema';
import tasksModel from '../../../../models/tasksSchema';
import employeeModel from '../../../../models/employeeSchema';

db_conn();

export default function Tasks(req, res) {
    switch (req.method) {
        case 'GET':
            return getTasks(req, res);
        case 'PUT':
            return EditTask(req, res);
        case 'DELETE':
            return deleteTask(req, res);
        default:
            res.status(404).send('use proper method')
    }
}

const getTasks = async (req, res) => {
    const { tid, page, rowsPerPage } = req.query;
    try {
        const tasks = await tasksModel.findOne({ taskId: tid })
        const tids = tasks.tasks.map((t) => t.tid)

        const data = await productModel.find({ _id: tids })
            .skip((parseInt(page)) * parseInt(rowsPerPage))
            .limit(parseInt(rowsPerPage))

        const totalCount = tids.length;
        // console.log(data)
        res.json({ data, totalCount, oldAssignedDate: tasks.date })

    } catch (err) {
        res.status(500).send('error while getting tasks');
    }
}

const EditTask = async (req, res) => {
    const { tid } = req.query;
    try {

        const user = await employeeModel.findOne({ dealAyoId: req.body.toEmp });

        const task = await tasksModel.findOneAndUpdate({ taskId: tid }, {
            $set: {
                date: req.body.date,
                assignToDealAyoId: req.body.toEmp,
                assignToName: user.firstName,
            }
        })

        const ids = task.tasks.map((t) => {
            return t.tid
        })

        await productModel.updateMany(
            { _id: { $in: ids } },
            {
                $set: {
                    assignDate: req.body.date,
                    assignToDealAyoId: req.body.toEmp,
                    assignToName: user.firstName,
                },
            }
        )
        res.send('update')
    } catch (err) {
        console.log(err)
        res.status(500).send('Error while updating task')
    }
}

const deleteTask = async (req, res) => {
    const { tid } = req.query;
    try {
        const tasks = await tasksModel.findOneAndUpdate(
            {
                taskId: tid
            },
            {
                $unset: {
                    assignToDealAyoId: '',
                    assignToName: '',
                }
            }
        )
        await productModel.updateMany({ _id: tasks.tasks.map((t) => t.tid) }, {
            $unset: {
                assignDate: '',
                assignToDealAyoId: '',
                assignToName: '',
                tasksId: ''
            }
        }, { new: true })
        
        res.send('deleted')
    } catch (err) {
        res.status(500).send('error while deleting task');
    }
}