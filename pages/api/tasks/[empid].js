import db_conn from "../../../helpers/db_conn";
import productModel from '../../../models/productSchema';
import categoryModel from '../../../models/categorySchema';
import attendanceModel from '../../../models/attendanceSchema';
import tokenPayload from "../../../controllers/tokenPayload";

db_conn();

export default function Tasks(req, res) {
    switch (req.method) {
        case 'GET':
            return getAssinedTasks(req, res);
        case 'POST':
            return assignTasks(req, res);
        default:
            res.status(404).send('use proper method')
    }
}

const getAssinedTasks = async (req, res) => {
    await productModel.find({
        assignTo: tokenPayload(req.cookies.token).dealAyoId,
        assignDate: {
            "$gte": new Date().setHours(0, 0, 0, 0),
            "$lt": new Date().setHours(24)
        }
    }).then((product) => {
        res.status(200).json(product)
    }).catch(() => {
        res.status(500).send('Error occured in checking assigned tasks')
    })
}

const assignTasks = async (req, res) => {
    //use for time calculation
    const categories = await categoryModel.find()
        .then((categories) => categories)
        .catch(() => { res.status(500).send('Error occured while fetching tasks') })
    await productModel.find({
        entryStatus: false,
        assignDate: {
            $not: {
                "$gte": new Date().setHours(0, 0, 0, 0),
                "$lt": new Date().setHours(24)
            }
        }
    }).limit(200).then(async (products1) => {
        const workingMins = 8 * 60;  //in mins
        var catgMins = 0;
        const tasks = [];
        for (let product of products1) {
            catgMins += categories.find(e => e.category === product.category).time;
            if (catgMins <= workingMins) {
                tasks.push(product);
                // set assign date and assignedTo to products
                await productModel.updateOne({ _id: product._id.toString() }, {
                    $set: {
                        assignDate: new Date(),
                        assignTo: tokenPayload(req.cookies.token).dealAyoId
                    }
                }, { upsert: true })
                if (catgMins >= workingMins) {
                    break;
                }
            }
        }
        await attendanceModel.updateOne({
            date: {
                "$gte": new Date().setHours(0, 0, 0, 0),
                "$lt": new Date().setHours(24)
            },
            "employees.dealAyoId": tokenPayload(req.cookies.token).dealAyoId
        }, {
            $set: {
                "employees.$.tasksAssigned": tasks.length
            }
        }).then(() => {
            res.status(200).json(tasks)
        })
    })
}

