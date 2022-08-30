// import db_conn from "../../../helpers/db_conn";
// import productModel from '../../../models/productSchema';
// import attendanceModel from '../../../models/attendanceSchema';
// import tokenPayload from "../../../controllers/tokenPayload";

// db_conn();

// export default function Tasks(req, res) {
//     switch (req.method) {
//         case 'POST':
//             return assignTasks(req, res);
//         default:
//             res.status(404).send('use proper method')
//     }
// }

// const assignTasks = async (req, res) => {

//     await productModel.find({
//         entryStatus: false,
//         assignDate: {
//             $not: {
//                 "$gte": new Date().setHours(0, 0, 0, 0),
//                 "$lt": new Date().setHours(24)
//             }
//         }
//     }).limit(200).then(async (products1) => { })
// }