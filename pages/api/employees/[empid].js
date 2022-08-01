import db_conn from "../../../helpers/db_conn";
import employeeModel from '../../../models/employeeSchema'

db_conn();

export default function employee(req, res) {
    switch (req.method) {
        case 'PUT':
            return updateEmployee(req, res);
        case 'DELETE':
            return deleteEmployee(req, res);
        default:
            res.status(404).send('Use proper method')
    }
}

const updateEmployee = async (req, res) => {
    const { empid } = req.query;
    await employeeModel.findByIdAndUpdate(empid, {
        $set: {
            // dealAyoId: req.body.daId,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            // mobile: req.body.mobile,
            // email: req.body.email,
            role: req.body.role,
            startTime: req.body.startTime,
            endTime: req.body.endTime,
            decreaseTask: req.body.decreaseTask,
            password: req.body.password,
        }
    }).then(() => {
        res.send('Employee updated sucessfully')
    }).catch(() => {
        res.status(500).send('Something went wrong')
    })
}

const deleteEmployee = async (req, res) => {
    const { empid } = req.query;
    await employeeModel.deleteOne({ _id: empid })
        .then(() => {
            res.status(200).send('Employee deleted sucessfully');
        }).catch(() => {
            res.status(500).send('Something went wrong')
        })
}