import db_conn from '../../../helpers/db_conn';
import employeeModel from '../../../models/employeeSchema';
import jwt from 'jsonwebtoken';

db_conn();

export default function verifyToken(req, res) {
    switch (req.method) {
        case 'POST':
            return verify(req, res);
        default:
            res.status(404).send('use proper method');
    }
}

const verify = async (req, res) => {
    const token = req.cookies.token;
    const tokenVerify = jwt.verify(token, process.env.SECRET_KEY);
    await employeeModel.findOne({ _id: tokenVerify._id, "tokens.token": token }, { password: 0, tokens: 0 })
        .then((emp) => {
            res.status(200).json(emp)
        }).catch(() => {
            res.status(500).send('Erro while verifying token');
        })
}