import db_conn from "../../../helpers/db_conn";
import employeeModel from '../../../models/employeeSchema';
import bcrypt from 'bcrypt';

db_conn();

export default function login(req, res) {
    switch (req.method) {
        case 'POST':
            return loginUser(req, res);
        default:
            res.status(500).send('User proper method');

    }
}

const loginUser = async (req, res) => {
    await employeeModel.findOne({
        dealAyoId: req.body.dealAyoId,
    }).then(async (emp) => {
        if (emp) {
            const passwordMatch = await bcrypt.compare(req.body.password, emp.password);
            if (passwordMatch) {
                const token = await emp.generateAuthToken(req, res);
                res.status(200).send(token)
            } else {
                res.status(401).send('Password not matching')
            }
        } else {
            res.status(401).send('you are not registered user')
        }
    }).catch(() => {
        res.status(500).send('something went wrong')
    })
}