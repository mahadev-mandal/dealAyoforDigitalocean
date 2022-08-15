import db_conn from "../../../helpers/db_conn";
import employeeModel from '../../../models/employeeSchema';
import jwt from 'jsonwebtoken';

db_conn();

export default async function login(req, res) {
    switch (req.method) {
        case 'POST':
            return loginUser(req, res);
        default:
            res.status(500).send('User proper method');

    }
}

const loginUser = async (req, res) => {
    await employeeModel.findOne({ dealAyoId: req.body.dealAyoId, })

        .then((emp) => {
            if (emp) {
                if (emp.password === req.body.password) {
                    const token = jwt.sign(
                        {
                            _id: emp._id, 
                            dealAyoId: emp.dealAyoId, 
                            name: emp.firstName, 
                            role: emp.role
                        },
                        process.env.SECRET_KEY
                    )
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