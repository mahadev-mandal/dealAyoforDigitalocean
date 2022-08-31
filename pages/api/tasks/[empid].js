import db_conn from "../../../helpers/db_conn";
import productModel from '../../../models/productSchema';
import categoryModel from '../../../models/categorySchema';
import attendanceModel from '../../../models/attendanceSchema';
import tokenPayload from "../../../controllers/tokenPayload";
import employeeModel from '../../../models/employeeSchema';

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
    const { page, rowsPerPage } = req.query;
    await productModel.find({
        assignToDealAyoId: tokenPayload(req.cookies.token).dealAyoId,
        assignDate: {
            "$gte": new Date().setHours(0, 0, 0, 0),
            "$lt": new Date().setHours(24)
        }
    }).skip(parseInt(rowsPerPage) * parseInt(page)).limit(parseInt(rowsPerPage)).then((product) => {
        res.status(200).json(product)
    }).catch(() => {
        res.status(500).send('Error occured in checking assigned tasks')
    })
}

const assignTasks = async (req, res) => {
    try {
        let assignedTasks = [];
        var catgMins = 0;

        //get time of categories to assign tasks according to time
        const categories = await categoryModel.find();

        //get total working time in mins of employees
        const employee = await employeeModel.findOne({ dealAyoId: tokenPayload(req.cookies.token).dealAyoId })
        const startTime = new Date(`2011/02/07 ${employee.startTime}`);
        const endTime = new Date(`2011/02/07 ${employee.endTime}`);
        const startTimeMins = startTime.getHours() * 60 + startTime.getMinutes();
        const endTimeMins = endTime.getHours() * 60 + endTime.getMinutes();
        let workingMins = endTimeMins - startTimeMins;


        //find max two hundreds products and then assign from in according to it category mins
        const products = await productModel.find({
            entryStatus: false,
            assignDate: {
                $not: {
                    "$gte": new Date().setHours(0, 0, 0, 0),
                    "$lt": new Date().setHours(24)
                }
            }
        }).limit(200)

        // //filtering tasks from 200 tasks untill working min <= categoryMins of products
        for (let product of products) {
            catgMins += categories.find(e => e.category === product.category).time;
            if (catgMins <= workingMins) {
                assignedTasks.push(product);
                if (catgMins >= workingMins) {
                    break;
                }
            }
        }

        //update assignDate and assignTo of filterd froducts 
        const updateMany = await productModel.updateMany({ _id: assignedTasks.filter(p => p._id) }, {
            $set: {
                assignDate: new Date(),
                assignToDealAyoId: tokenPayload(req.cookies.token).dealAyoId,
                assignToName: tokenPayload(req.cookies.token).name
            }
        })

        //update how many tasks asiigned to employee in attendace collection
        await attendanceModel.updateOne({
            date: {
                "$gte": new Date().setHours(0, 0, 0, 0),
                "$lt": new Date().setHours(24)
            },
            "employees.dealAyoId": tokenPayload(req.cookies.token).dealAyoId
        }, {
            $set: {
                "employees.$.tasksAssigned": updateMany.modifiedCount
            }
        })
        res.status(200).json(assignTasks);
    } catch (err) {
        console.log(err)
        res.status(500).send('Error while assigning Tasks')
    }
}

// let totalFoundProducts;
// let assignedTasks;
// let workingMins;
// var catgMins = 0;

// //get time of categories to assign tasks according to time
// const categories = await categoryModel.find()
//     .then((categories) => categories)
//     .catch(() => { res.status(500).send('Error occured while fetching tasks') })

// //get total working time in mins of employees
// await employeeModel.findOne({ dealAyoId: tokenPayload(req.cookies.token).dealAyoId })
//     .then((emp) => {
//         const startTime = new Date(`2011/02/07 ${emp.startTime}`);
//         const endTime = new Date(`2011/02/07 ${emp.endTime}`);
//         const startTimeMins = startTime.getHours() * 60 + startTime.getMinutes();
//         const endTimeMins = endTime.getHours() * 60 + endTime.getMinutes();
//         workingMins = endTimeMins - startTimeMins;
//     }).catch(() => { res.status(500).send('Error occured while fetching emp') })

// //find max two hundreds products and then assign from in according to it category mins
// await productModel.find({
//     entryStatus: false,
//     assignDate: {
//         $not: {
//             "$gte": new Date().setHours(0, 0, 0, 0),
//             "$lt": new Date().setHours(24)
//         }
//     }
// }).limit(200).then((products) => {
//     totalFoundProducts = products;
// })

// //filtering tasks from 200 tasks untill working min <= categoryMins of products
// for (let product of totalFoundProducts) {
//     catgMins += categories.find(e => e.category === product.category).time;
//     if (catgMins <= workingMins) {
//         assignedTasks.push(product);
//         if (catgMins >= workingMins) {
//             break;
//         }
//     }
// }

// //update assignDate and assignTo of filterd froducts
// await productModel.updateMany({ _id: assignedTasks.filter(p => p._id) }, {
//     $set: {
//         assignDate: new Date(),
//         assignTo: `${tokenPayload(req.cookies.token).name}(${tokenPayload(req.cookies.token).dealAyoId})`
//     }
// }, { upsert: true, })

// //update how many tasks asiigned to employee in attendace collection
// await attendanceModel.updateOne({
//     date: {
//         "$gte": new Date().setHours(0, 0, 0, 0),
//         "$lt": new Date().setHours(24)
//     },
//     "employees.dealAyoId": tokenPayload(req.cookies.token).dealAyoId
// }, {
//     $set: {
//         "employees.$.tasksAssigned": assignedTasks.length
//     }
// }).then(() => {
//     res.status(200).json(assignedTasks)
// })


// await productModel.find({
//     entryStatus: false,
//     assignDate: {
//         $not: {
//             "$gte": new Date().setHours(0, 0, 0, 0),
//             "$lt": new Date().setHours(24)
//         }
//     }
// }).limit(200).then(async (products1) => {
//     var catgMins = 0;
//     const tasks = [];
//     for (let product of products1) {
//         catgMins += categories.find(e => e.category === product.category).time;
//         if (catgMins <= workingMins) {
//             tasks.push(product);
//             // set assign date and assignedTo to products
//             await productModel.updateOne({ _id: product._id.toString() }, {
//                 $set: {
//                     assignDate: new Date(),
//                     assignTo: tokenPayload(req.cookies.token).dealAyoId
//                 }
//             }, { upsert: true })
//             if (catgMins >= workingMins) {
//                 break;
//             }
//         }
//     }
//     await attendanceModel.updateOne({
//         date: {
//             "$gte": new Date().setHours(0, 0, 0, 0),
//             "$lt": new Date().setHours(24)
//         },
//         "employees.dealAyoId": tokenPayload(req.cookies.token).dealAyoId
//     }, {
//         $set: {
//             "employees.$.tasksAssigned": tasks.length
//         }
//     }).then(() => {
//         res.status(200).json(tasks)
//     })
// })
