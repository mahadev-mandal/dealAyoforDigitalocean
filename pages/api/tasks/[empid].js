import db_conn from "../../../helpers/db_conn";
import productModel from '../../../models/productSchema';
import categoryModel from '../../../models/categorySchema';
import attendanceModel from '../../../models/attendanceSchema';
import tokenPayload from "../../../controllers/tokenPayload";

db_conn();

export default function Tasks(req, res) {
    switch (req.method) {
        case 'POST':
            return getAssignedTasks(req, res);
        default:
            res.status(404).send('use proper method')
    }
}

const getAssignedTasks = async (req, res) => {

    //use for time calculation
    const categories = await categoryModel.find()
        .then((categories) => categories)
        .catch(() => { res.status(500).send('Error occured while fetching tasks') })
    //checks if task assigned today
    await productModel.find({
        assignTo: tokenPayload(req.cookies.token).dealAyoId,
        assignDate: {
            "$gte": new Date().setHours(0, 0, 0, 0),
            "$lt": new Date().setHours(24)
        }
    }).then(async (products) => {
        // if lenth is greater than 1 it means tasks is assigned so send same tasks to frontend
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
                await attendanceModel.findOneAndUpdate({
                    date: {
                        "$gte": new Date().setHours(0, 0, 0, 0),
                        "$lt": new Date().setHours(24)
                    },
                    "employees.dealAyoId": tokenPayload(req.cookies.token).dealAyoId
                }, {
                    $set: {
                        "employees.$.tasksAssigned": tasks.length
                    }
                }, { new: true }).then((r) => {
                    console.log(r)
                    res.status(200).json(tasks)
                })
            })
        }

    }).catch((err) => {
        res.status(500).send('Error occured while fetching tasks')
        console.log(err)
    })
}

// const getAssignedTasks = async (req, res) => {
//     await attendanceModel.find({
//         date: {
//             "$gte": new Date().setHours(0, 0, 0, 0),
//             "$lt": new Date().setHours(23)
//         },
//         "employees.dealAyoId":'e12'
//     }).then((r) => {
//         res.status(200).json(r)
//     }).catch((err) => {
//         console.log(err)
//     })
// }