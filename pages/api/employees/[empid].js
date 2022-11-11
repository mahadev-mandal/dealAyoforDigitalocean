import db_conn from "../../../helpers/db_conn";
import employeeModel from '../../../models/employeeSchema';
import bcrypt from 'bcrypt';

db_conn();

export default function employee(req, res) {
    switch (req.method) {
        case 'GET':
            return getEmployee(req, res);
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
    try {
        const emp = await employeeModel.findById(empid);

        emp.firstName = req.body.firstName;
        emp.lastName = req.body.lastName;
        emp.mobile = req.body.mobile;
        emp.email = req.body.email;
        if (emp.role != req.body.role) {
            emp.role = req.body.role;
            emp.tokens = [];
        }
        emp.startTime = req.body.startTime;
        emp.endTime = req.body.endTime;
        emp.decreaseTask = req.body.decreaseTask;
        if (req.body.profilePicPath) {
            emp.profilePicPath = req.body.profilePicPath
        }
        emp.workingDays = req.body.workingDays;
        const passwordMatch = await bcrypt.compare(req.body.password, emp.password);
        if (req.body.password != '' && !passwordMatch) {
            emp.password = req.body.password;
            emp.tokens = [];
        }
        emp.staus = req.body.status;
        emp.level = req.body.level,

            await emp.save();
        res.send('Employee updated sucessfully')
    } catch (err) {
        res.status(500).send('Employee updation failed')
    }

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

const getEmployee = async (req, res) => {
    try {
        const { empid } = req.query;
        const employee = await employeeModel.findOne({
            dealAyoId: empid
        },
            {
                password: 0,
                tokens: 0,
                _id: 0,
                __v: 0
            }
        )
        res.json(employee)
    } catch (err) {
        res.status(500).send("error while getting employee details")
    }
}