import db_conn from "../../../helpers/db_conn";
import uploadFileModel from '../../../models/uploadFileSchema';
import fileTaskModel from '../../../models/fileTasksSchema';

db_conn();

export default function file(req, res) {
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

    await uploadFileModel.findById(pid)
        .then((product) => {
            res.send(product)
        }).catch(() => {
            res.status(500).send('error while fetching product');
        })
}

const updateProduct = async (req, res) => {
    const { fid,  } = req.query;
    console.log(req.body)
    try {
        const productBeforUpdate = await uploadFileModel.findByIdAndUpdate(fid, {
            $set: {
                doneStatus: req.body.doneStatus,
                doneDate: req.body.doneDate,
                remarks: req.body.remarks,
                // errorTask: req.body.errorTask
            }
        });

        if (productBeforUpdate) {
            if ('remarks' in req.body) {
                await uploadFileModel.findByIdAndUpdate(fid, {
                    $set: {
                        remarks: req.body.remarks
                    }
                });
            }
            if ('doneStatus' in req.body) {
            
                await fileTaskModel.updateOne({ taskId: req.body.taskId, "tasks.tid": fid }, {
                    $set: {
                        "tasks.$.doneStatus": req.body.doneStatus,
                        // "tasks.$.errorTask": req.body.errorTask,
                    }
                })
            }
        }
        res.status(200).send('product updated sucessfully')
    } catch (err) {
        res.status(500).send('product updation failed');
    }
}

const deleteProduct = async (req, res) => {
    const { fid } = req.query;
    await uploadFileModel.findByIdAndDelete(fid)
        .then(() => {
            res.status(200).send('product deleted sucessfully')
        }).catch(() => {
            res.status(500).send('product deletion failed')
        })
}

