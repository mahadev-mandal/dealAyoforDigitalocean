import db_conn from '../../../helpers/db_conn';
import productModel from '../../../models/productSchema';

db_conn();

export default function search(req, res) {
    switch (req.method) {
        case 'GET':
            return searchEmployees(req, res);
        default:
            res.status(404).send('use Proper method')
    }
}

const searchEmployees = async (req, res) => {
    const { searchText } = req.query;
    await productModel.find({ $text: { $search: searchText } })
        .then((r) => {
            console.log(r.length);
            res.json(r)
        }).catch((err) => {
            console.log('err');
            res.json(err);
        })
}