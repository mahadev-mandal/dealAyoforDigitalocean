import db_conn from "../../../helpers/db_conn";
import productUpdateModel from '../../../models/productUpdateSchema';
import updateTasks from '../../../models/updateTasksSchema';

db_conn();

export default function Tasks(req, res) {
    switch (req.method) {
        case 'GET':
            return getTasks(req, res);
        case 'POST':
            return saveComment(req, res);
        default:
            res.status(404).send('use proper method')
    }
}

const getTasks = async (req, res) => {
    const { tid, page, rowsPerPage } = req.query;
    try {
        const tasks = await updateTasks.findOne({ taskId: tid })
        const tids = tasks.tasks.map((t) => t.tid)

        const data = await productUpdateModel.find({ _id: tids })
            .skip((parseInt(page)) * parseInt(rowsPerPage))
            .limit(parseInt(rowsPerPage))

        const totalCount = tids.length;
        // console.log(data)
        res.json({ data, totalCount })

    } catch (err) {
        console.log(err)
        res.status(500).send('error while getting tasks');
    }
}

const saveComment = async (req, res) => {
    const { tid } = req.query;
    try {
        await updateTasks.updateOne({ taskId: tid }, {
            $set: {
                comment: req.body.comment
            }
        })
        res.send('saved')
    } catch (err) {
        res.status(500).send('Error while saving comment')
    }
}