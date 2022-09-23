import db_conn from "../../../helpers/db_conn";
import uploadFileModel from '../../../models/uploadFileSchema';

db_conn();
export default async function getFiles(req, res) {
    const { page, rowsPerPage } = req.query;
    try {
        const totalCount = await uploadFileModel.estimatedDocumentCount();
        const data = await uploadFileModel.find()
            .skip((parseInt(page)) * parseInt(rowsPerPage))
            .limit(parseInt(rowsPerPage));
        res.send({ data, totalCount })
    } catch (err) {
        console.log(err);
        res.status(500).send('Error while fetching file')
    }
}