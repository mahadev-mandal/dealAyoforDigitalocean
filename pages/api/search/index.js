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
    const { searchText, pid } = req.query;
    if (pid) {
        await productModel.find({ _id: pid })
            .then((r) => {
                res.json(r)
            }).catch((err) => {
                console.log('err');
                res.json(err);
            })
    } else {
        await productModel.find({ $text: { $search: searchText } })
            .then((r) => {
                res.json(r)
            }).catch((err) => {
                console.log('err');
                res.json(err);
            })
    }
}