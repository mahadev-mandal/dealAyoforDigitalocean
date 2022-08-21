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
            return updateProduct(req, res);
        case 'DELETE':
            return deleteProducts(req, res);
        default:
            res.status(500).send('Use proper methods');
    }
}

const getProducts = async (req, res) => {
    const { page, rowsPerPage } = req.query;
    await productModel.find()
        .skip((parseInt(page)) * parseInt(rowsPerPage))
        .limit(parseInt(rowsPerPage))
        .then((data) => {
            res.status(200).json(data);
        }).catch(() => {
            res.status(500).send('Error occured while fetching products data')
        })
}

const saveProducts = async (req, res) => {
    const products = req.body;
    await productModel.insertMany(products)
        .then(() => {
            res.status(200).send('products saved')
        }).catch(() => {
            res.status(500).send('Error occured while saving products')
        })
}

const updateProduct = async (req, res) => {
    const updateDetails = req.body.updateDetails;
    await productModel.updateOne({ _id: req.body._id }, {
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
    await productModel.deleteMany({ _id: { $in: req.body._ids } })
        .then(() => {
            res.send('deleted sucessfully')
        }).catch(() => {
            res.status(500).send('Error occured while deleting')
        })
}