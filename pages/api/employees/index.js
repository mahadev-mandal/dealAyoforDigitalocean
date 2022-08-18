import db_conn from '../../../helpers/db_conn';
import employeeModel from '../../../models/employeeSchema'

db_conn();

export default function SwitchMethod(req, res) {
    switch (req.method) {
        case "GET":
            return getEmployees(req, res);
        case "POST":
            return addEmployee(req, res)
        default:
            res.status(404).send('Use proper method')
    }
}

const getEmployees = async (req, res) => {
    const { page, rowsPerPage } = req.query;
    
    await employeeModel.find({}, { password: 0 })
        .skip(parseInt(rowsPerPage) * parseInt(page))
        .limit(parseInt(rowsPerPage))
        .then((employees) => {
            res.status(200).json(employees);
        }).catch(() => {
            res.status(500).send('Internal server Error');
        })
}

const addEmployee = async (req, res) => {
    const employee = new employeeModel({
        dealAyoId: req.body.dealAyoId,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        mobile: req.body.mobile,
        email: req.body.email,
        role: req.body.role,
        startTime: req.body.startTime,
        endTime: req.body.endTime,
        decreaseTask: req.body.decreaseTask,
        password: req.body.password,
    })
    await employee.save()
        .then(() => {
            res.status(200).send('Employee added successfully');
        }).catch((err) => {
            console.log(err)
            if (err.keyPattern.dealAyoId === 1) {
                res.status(403).send('Deal ayo Id is already present')
            } else if (err.keyPattern.mobile === 1) {
                res.status(403).send('Mobile no. is already present')
            } else if (err.keyPattern.email === 1) {
                res.status(403).send('Email is already present')
            } else {
                res.status(500).send('Internal server Error');
            }
        });
}