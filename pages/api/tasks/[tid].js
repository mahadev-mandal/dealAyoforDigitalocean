import db_conn from "../../../helpers/db_conn";
import productModel from '../../../models/productSchema';

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
        const data = await productModel.find({ tasksId: tid })
            .skip((parseInt(page)) * parseInt(rowsPerPage))
            .limit(parseInt(rowsPerPage))

        const totalCount = await productModel.countDocuments({ tasksId: tid });

        res.json({ data, totalCount })

    } catch (err) {
        res.status(500).send('error while getting tasks');
    }
}