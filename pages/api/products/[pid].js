import db_conn from '../../../helpers/db_conn';
import attendanceModel from '../../../models/attendanceSchema';
import productModel from '../../../models/productSchema';

db_conn()

export default function products(req, res) {
    switch (req.method) {
        case 'PUT':
            return updateProduct(req, res);
        case 'DELETE':
            return deleteProduct(req, res)
        default:
            res.status(500).send('Use proper method');
    }
}

const updateProduct = async (req, res) => {
    const { pid } = req.query;
    await productModel.updateOne({ _id: pid }, {
        $set: {
            entryStatus: req.body.entryStatus,
            entryDate: req.body.date
        }
    }).then(async () => {
        if (req.body.entryStatus) {
            //increment tasksCompleted by one if entryStatus is true
            await attendanceModel.updateOne({
                date: {
                    "$gte": new Date().setHours(0, 0, 0, 0),
                    "$lt": new Date().setHours(24)
                },
                "employees.dealAyoId": req.body.dealAyoId
            }, {
                $inc: {
                    "employees.$.tasksCompleted": 1
                }
            }).then(() => {
                res.status(200).send('product updated sucessfully')
            })
        } else {
            //decrease tasksCompleted by 1 if entryStatus is false
            await attendanceModel.updateOne({
                date: {
                    "$gte": new Date().setHours(0, 0, 0, 0),
                    "$lt": new Date().setHours(24)
                },
                "employees.dealAyoId": req.body.dealAyoId
            }, {
                $inc: {
                    "employees.$.tasksCompleted": -1
                }
            }).then(() => {
                res.status(200).send('product updated sucessfully')
            })
        }
    }).catch(() => {
        res.status(500).send('product updation failed');
    })
}

const deleteProduct = async (req, res) => {
    const { pid } = req.query;
    await productModel.findByIdAndDelete(pid)
        .then(() => {
            res.status(200).send('product deleted sucessfully')
        }).catch(() => {
            res.status(500).send('product deletion failed')
        })
}