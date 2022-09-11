import db_conn from '../../../helpers/db_conn';
import attendanceModel from '../../../models/attendanceSchema';
import productModel from '../../../models/productSchema';
import tasksModel from '../../../models/tasksSchema';
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
    const { pid,  } = req.query;
    try {
        const productBeforUpdate = await productModel.findByIdAndUpdate(pid, {
            $set: {
                entryStatus: req.body.entryStatus,
                entryDate: req.body.date,
                remarks: req.body.remarks,
                errorTask: req.body.errorTask
            }
        });

        if (productBeforUpdate) {
            if ('remarks' in req.body) {
                await productModel.findByIdAndUpdate(pid, {
                    $set: {
                        remarks: req.body.remarks
                    }
                });
            }
            if ('entryStatus' in req.body || 'errorTask' in req.body) {
                await tasksModel.updateOne({ taskId: 5, "tasks.tid": pid }, {
                    $set: {
                        "tasks.$.entryStatus": req.body.entryStatus,
                        "tasks.$.errorTask": req.body.errorTask,
                    }
                })
                await attendanceModel.updateOne({
                    date: {
                        "$gte": new Date().setHours(0, 0, 0, 0),
                        "$lt": new Date().setHours(24)
                    },
                    "employees.dealAyoId": tokenPayload(req.cookies.token).dealAyoId
                }, {
                    $inc: {
                        "employees.$.tasksCompleted": ('entryStatus' in req.body && productBeforUpdate.entryStatus != req.body.entryStatus) ?
                            req.body.entryStatus ? 1 : -1 : 0,
                        "employees.$.errorTasks": ('errorTask' in req.body && productBeforUpdate.errorTask != req.body.errorTask) ?
                            req.body.errorTask ? 1 : -1 : 0,
                    }
                });
            }
        }
        res.status(200).send('product updated sucessfully')
    } catch (err) {
        res.status(500).send('product updation failed');
    }
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