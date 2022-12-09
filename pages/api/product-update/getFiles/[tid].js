import db_conn from "../../../../helpers/db_conn";
import uploadFileModel from '../../../../models/uploadFileSchema';
import fileTaskModel from '../../../../models/fileTasksSchema';

db_conn();
export default async function getFiles(req, res) {
    const { page, rowsPerPage, tid } = req.query;
    try {
        const tasks = await fileTaskModel.findOne({ taskId: tid });
        const tids = tasks.tasks.map((t) => t.tid)
        const data = await uploadFileModel.find({ _id: tids })
            .skip((parseInt(page)) * parseInt(rowsPerPage))
            .limit(parseInt(rowsPerPage));
        res.send({ data })
    } catch (err) {
        console.log(err);
        res.status(500).send('Error while fetching file')
    }
}