import db_conn from '../../../helpers/db_conn';
import productModel from '../../../models/productSchema'

db_conn();

export default function products(req, res) {
    switch (req.method) {
        case 'GET':
            return getProducts(req, res);
        case 'POST':
            return saveProducts(req, res);
        case 'PUT':
            return updateProducts(req, res);
        case 'DELETE':
            return deleteProducts(req, res);
        default: {
            res.status(500).send('Use proper methods');
            console.log('use proper method')

        }
    }
}

const getProducts = async (req, res) => {
    const {
        page,
        rowsPerPage,
        statusFilter,
        empFilter,
        date,
        title,
        supplier,
        brand,
        category,
        model,
        remarks,
    } = req.query;
    try {
        const query = {
            assignToDealAyoId: empFilter,
        }
        if (statusFilter == '') {
            delete query['assignDate'];
        } else if (statusFilter == 'assigned') {
            query.assignDate = { $ne: null }
        } else if (statusFilter == 'unassigned') {
            query.assignDate = null
        } else if (statusFilter == 'entry-done') {
            query.entryStatus = true;
            query.assignDate = { $ne: null }
        } else if (statusFilter == 'entry-not-done') {
            query.entryStatus = false;
            query.assignDate = { $ne: null }
        } else if (statusFilter == 'error-tasks') {
            query.errorTask = true;
        }
        if (empFilter == '') {
            delete query['assignToDealAyoId'];
        }
        if (date) {
            query.entryDate = {
                "$gte": new Date(date).setHours(0, 0, 0, 0),
                "$lt": new Date(date).setHours(24)
            };
        }
        [{ remarks }, { category }, { title }, { supplier }, { brand }, { model }].forEach((d) => {
            for (let key in d) {
                if (d[key]) {
                    query[key] = { $regex: d[key].trim(), '$options': 'i' }
                }
            }
        })
        const totalCount = await productModel.countDocuments(query);
        // { category: { $regex: category ? 'electrical' : 'accessories', '$options': 'i' } }
        const data = await productModel.find(query)
            .skip((parseInt(page)) * parseInt(rowsPerPage)
            ).limit(parseInt(rowsPerPage))

        res.status(200).json({ data, totalCount });
    } catch (err) {
        res.status(500).send('Error occured while fetching products data')
    }
}
const saveProducts = async (req, res) => {
    const products = req.body;
    await productModel.insertMany(products)
        .then((r) => {
            console.log(r.length)
            res.status(200).send(`${r.length} products saved`)
        }).catch((err) => {
            console.log(err)
            res.status(500).send(err)
        })
}

const updateProducts = async (req, res) => {
    try {
        const products = req.body;
        products.map(async (p) => {
            let modifiedData = [];
            await productModel.updateOne({
                model: p.model,
                supplier: p.supplier
            },
                p,
            )
            modifiedData = [...modifiedData, { model: p.model }]
            return modifiedData;
        })

        res.send('updated')
    } catch (err) {
        console.log(err);
        res.status(500).send(err)
    }
}

// const updateProduct = async (req, res) => {
//     const updateDetails = req.body.updateDetails;
//     await productModel.updateOne({ _id: req.body._id }, {
//         $set: {
//             lastUpdateDetails: updateDetails
//         }
//     }).then(() => {
//         res.status(200).send('product updated');
//     }).catch(() => {
//         res.status(500).send('Product updation failed');
//     })
// }

const deleteProducts = async (req, res) => {
    await productModel.deleteMany({ _id: { $in: req.body._ids } })
        .then(() => {
            res.send('deleted sucessfully')
        }).catch(() => {
            res.status(500).send('Error occured while deleting')
        })
}