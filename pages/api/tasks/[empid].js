import db_conn from "../../../helpers/db_conn";
import productModel from '../../../models/productSchema';
import categoryModel from '../../../models/categorySchema';
import attendanceModel from '../../../models/attendanceSchema';

db_conn();

export default function Tasks(req, res) {
    switch (req.method) {
        case 'POST':
            return getAssignedTasks(req, res);
        default:
            res.status(500).send(req.method)
    }
}

const getAssignedTasks = async (req, res) => {
    //use for time calculation
    const categories = await categoryModel.find()
        .then((categories) => categories)
        .catch(() => { res.status(500).send('Error occured while fetching tasks') })
    //checks if task assigned today
    await productModel.find({
        assignTo: req.body.dealAyoId,
        assignDate: {
            "$gte": new Date().setHours(0, 0, 0, 0),
            "$lt": new Date().setHours(24)
        }
    }).then(async (products) => {
        // if lenth is greater than 1 it means tasks is assigned send same tasks to frontend
        if (products.length > 1) {
            res.status(200).json(products);
        } else {
            //if tasks is not assigned today
            await productModel.find({
                entryStatus: false,
                assignDate: {
                    $not: {
                        "$gte": new Date().setHours(0, 0, 0, 0),
                        "$lt": new Date().setHours(24)
                    }
                }
            }).limit(100).then(async (products1) => {
                const workingMins = 8 * 60;  //in mins
                var catgMins = 0;
                const tasks = [];
                for (let product of products1) {
                    catgMins += categories.find(e => e.category === product.category).time;
                    if (catgMins <= workingMins) {
                        tasks.push(product);
                        // set assign date to products
                        await productModel.updateOne({ _id: product._id.toString() }, {
                            $set: {
                                assignDate: new Date(),
                                assignTo: req.body.dealAyoId
                            }
                        }, { upsert: true })
                        if (catgMins >= workingMins) {
                            break;
                        }
                    }
                }
                await attendanceModel.findOneAndUpdate({
                    assignDate: {
                        "$gte": new Date().setHours(0, 0, 0, 0),
                        "$lt": new Date().setHours(24)
                    },
                    "employees.dealAyoId": req.body.dealAyoId
                }, {
                    $set: {
                        "employees.$.tasksAssigned": tasks.length
                    }
                }, { new: true }).then(() => {
                    res.status(200).json(tasks)
                })
            })
        }

    }).catch((err) => {
        res.status(500).send('Error occured while fetching tasks')
        console.log(err)
    })
}