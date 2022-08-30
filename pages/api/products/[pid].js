import db_conn from '../../../helpers/db_conn';
import attendanceModel from '../../../models/attendanceSchema';
import productModel from '../../../models/productSchema';
import tokenPayload from '../../../controllers/tokenPayload';

db_conn()

export default function products(req, res) {
    switch (req.method) {
        case 'GET':
            return getProduct(req, res);
        case 'PUT':
            return updateProduct(req, res);
        case 'DELETE':
            return deleteProduct(req, res)
        default:
            res.status(500).send('Use proper method');
    }
}

const getProduct = async (req, res) => {
    const { pid } = req.query;
    await productModel.findById(pid)
        .then((product) => {
            res.send(product)
        }).catch(() => {
            res.status(500).send('error while fetching product');
        })
}

const updateProduct = async (req, res) => {
    const { pid } = req.query;
console.log(req.body)
    await productModel.updateOne({ _id: pid }, {
        $set: {
            entryStatus: req.body.entryStatus,
            entryDate: req.body.date,
            remarks: req.body.remarks,
            error: req.body.error
        }
    }).then(async () => {
        if ('remarks' in req.body) {
            await productModel.findByIdAndUpdate(pid, {
                $set: {
                    remarks: req.body.remarks
                }
            }).then(() => {
                res.status(200).send('product updated sucessfully')
            })
        } else {
            await attendanceModel.updateOne({
                date: {
                    "$gte": new Date().setHours(0, 0, 0, 0),
                    "$lt": new Date().setHours(24)
                },
                "employees.dealAyoId": tokenPayload(req.cookies.token).dealAyoId
            }, {
                $inc: {
                    "employees.$.tasksCompleted": 'entryStatus' in req.body ? req.body.entryStatus ? 1 : -1 : 0,
                    "employees.$.errors": 'error' in req.body ? req.body.error ? 1 : -1 : 0,
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