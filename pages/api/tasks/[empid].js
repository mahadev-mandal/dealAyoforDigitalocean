import db_conn from "../../../helpers/db_conn";
import productModel from '../../../models/productSchema'
import categoryModel from '../../../models/categorySchema'

db_conn();

export default function Tasks(req, res) {
    switch (req.method) {
        case 'GET':
            return getAssignedTasks(req, res);
        default:
            res.status(500).send('Use proper methods')
    }
}

const getAssignedTasks = async (req, res) => {
    // const { empid } = req.query;

    const workingMins = 8 * 60;  //in mins
    let catgMins = 0;

    const categories = await categoryModel.find()
        .then((categories) => categories)
        .catch(() => { res.status(500).send('Error occured while fetching tasks') })

    await productModel.find({entryDate:''}).limit(100)
        .then(async (products) => {
            const tasks = [];
            //assign task according to category time
            for (let product of products) {
                catgMins += categories.find(e => e.category === product.category).time
                tasks.push(product)
                if (catgMins >= workingMins) {
                    break;
                }
            }
            res.status(200).send(tasks)
        }).catch(() => {
            res.status(500).send('Error occured while fetching tasks')
        })
}