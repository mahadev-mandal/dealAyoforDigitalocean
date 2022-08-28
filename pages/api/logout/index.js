import tokenPayload from "../../../controllers/tokenPayload";
import db_conn from "../../../helpers/db_conn";
import employeeModel from '../../../models/employeeSchema';

db_conn();

export default function logout(req, res) {
    switch (req.method) {
        case 'POST':
            return logoutUser(req, res);
        default:
            res.status(500).send('User proper method');

    }
}

const logoutUser = async (req, res) => {
    await employeeModel.updateOne(
        { _id: tokenPayload(req.cookies.token)._id },
        { $pull: { tokens: { token: req.cookies.token } } }
    ).then((r) => {
        if (r.modifiedCount) {
            res.send('logout sucessfull')
        } else {
            res.status(500).send('logout unsucessfull')
        }
    }).catch(() => {
        res.status(500).send('logout unsucessfull')
    })
}