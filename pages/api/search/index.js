import db_conn from '../../../helpers/db_conn';
import productModel from '../../../models/productSchema';

db_conn();

export default function search(req, res) {
    switch (req.method) {
        case 'GET':
            return searchProducts(req, res);
        default:
            res.status(404).send('use Proper method')
    }
}

const searchProducts = async (req, res) => {
    const { searchText, pid } = req.query;
    try {
        let data;
        let totalCount;
        if (pid) {
            data = await productModel.find({ _id: pid });
            totalCount = 1;
        } else {
            data = await productModel.find({ $text: { $search: searchText } });
            totalCount = await productModel.countDocuments({ $text: { $search: searchText } });
        }
        res.json({ data, totalCount });
    } catch (err) {
        res.json(err)
    }
}