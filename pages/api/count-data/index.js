
import db_conn from "../../../helpers/db_conn";
import employeeModel from '../../../models/employeeSchema';
import productModel from '../../../models/productSchema';
import categoryModel from '../../../models/categorySchema'
import tokenPayload from "../../../controllers/tokenPayload";

db_conn();
export default function countData(req, res) {
    const { collectionName } = req.query;
    switch (req.method, collectionName) {
        case 'GET', 'employees':
            return countEmployees(req, res)
        case 'GET', 'products':
            return countProducts(req, res)
        case 'GET', 'tasks':
            return countTasks(req, res)
        case 'GET', 'empTasks':
            return countEmpTasks(req, res)
        case 'GET', 'categories':
            return countCategories(req, res)
        default:
            res.status(404).send('use Proper method')

    }
} 

const countEmployees = async (req, res) => {
    await employeeModel.estimatedDocumentCount()
        .then((total) => {
            res.status(200).send(total)
        }).catch(() => {
            res.status(500).send("Error occured in counting employees")
        })
}
const countProducts = async (req, res) => {
    await productModel.estimatedDocumentCount()
        .then((total) => {
            res.status(200).send(total)
        }).catch(() => {
            res.status(500).send("Error occured in counting products")
        })
}

const countTasks = async (req, res) => {
    await productModel.countDocuments({
        assignStatus: true,
        assignDate: {
            "$gte": new Date().setHours(0, 0, 0, 0),
            "$lt": new Date().setHours(24)
        },
    })
        .then((total) => {
            res.status(200).send(total)
        }).catch(() => {
            res.status(500).send("Error occured in counting tasks")
        })
}

const countEmpTasks = async (req, res) => {
    await productModel.countDocuments({
        assignStatus: true,
        assignDate: {
            "$gte": new Date().setHours(0, 0, 0, 0),
            "$lt": new Date().setHours(24)
        },
        assignToDealAyoId: tokenPayload(req.cookies.token).dealAyoId
    })
        .then((total) => {
            res.status(200).send(total)
        }).catch(() => {
            res.status(500).send("Error occured in counting tasks")
        })
}

const countCategories = async (req, res) => {
    await categoryModel.estimatedDocumentCount()
        .then((total) => {
            res.status(200).send(total)
        }).catch(() => {
            res.status(500).send("Error occured in counting categories")
        })
}