import db_conn from "../../../helpers/db_conn";
import productModel from '../../../models/productSchema';
import tasksModel from '../../../models/tasksSchema';

db_conn();

export default function Tasks(req, res) {
    switch (req.method) {
        case 'GET':
            return getTasks(req, res);
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
        res.json({ data, totalCount })

    } catch (err) {
        console.log(err)
        res.status(500).send('error while getting tasks');
    }
}