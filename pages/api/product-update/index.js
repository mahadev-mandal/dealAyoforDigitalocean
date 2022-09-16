import db_conn from '../../../helpers/db_conn';
import productUpdateModel from '../../../models/productUpdateSchema'

db_conn();

export default function products(req, res) {
    switch (req.method) {
        case 'GET':
            return getProducts(req, res);
        case 'POST':
            return saveProducts(req, res);
        case 'PUT':
            return updateProduct(req, res);
        case 'DELETE':
            return deleteProducts(req, res);
        default: {
            res.status(500).send('Use proper methods');
            console.log('use proper method')

        }
    }
}

const getProducts = async (req, res) => {
    try {
        const { page, rowsPerPage, assignFilter, empFilter } = req.query;
        const query = {
            assignToDealAyoId: empFilter,
        }
        if (assignFilter == '') {
            delete query['assignDate'];
        } else if (assignFilter == 'assigned') {
            query.assignDate = { $ne: null }
        } else if (assignFilter == 'unassigned') {
            query.assignDate = null
        } else if (assignFilter == 'entry-done') {
            query.entryStatus = true;
            query.assignDate = { $ne: null }
        } else if (assignFilter == 'entry-not-done') {
            query.entryStatus = false;
            query.assignDate = { $ne: null }
        } else if (assignFilter == 'error-tasks') {
            query.errorTask = true;
        }
        if (empFilter == '') {
            delete query['assignToDealAyoId'];
        }

        const totalCount = await productUpdateModel.countDocuments(query);

        const data = await productUpdateModel.find(query)
            .skip((parseInt(page)) * parseInt(rowsPerPage)
            ).limit(parseInt(rowsPerPage))

        res.status(200).json({ data, totalCount });
    } catch (err) {
        res.status(500).send('Error occured while fetching products data')
    }
}
const saveProducts = async (req, res) => {
    const products = req.body;
    await productUpdateModel.insertMany(products)
        .then((r) => {
            console.log(r.length)
            res.status(200).send(`${r.length} products saved`)
        }).catch((err) => {
            console.log(err)
            res.status(500).send(err)
        })
}

const updateProduct = async (req, res) => {
    const updateDetails = req.body.updateDetails;
    await productUpdateModel.updateOne({ _id: req.body._id }, {
        $set: {
            lastUpdateDetails: updateDetails
        }
    }).then(() => {
        res.status(200).send('product updated');
    }).catch(() => {
        res.status(500).send('Product updation failed');
    })
}

const deleteProducts = async (req, res) => {
    await productUpdateModel.deleteMany({ _id: { $in: req.body._ids } })
        .then(() => {
            res.send('deleted sucessfully')
        }).catch(() => {
            res.status(500).send('Error occured while deleting')
        })
}