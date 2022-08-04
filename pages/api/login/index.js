import db_conn from "../../../helpers/db_conn";

db_conn();

export default async function login(req, res) {
    switch (req.method) {
        case 'POST':
            return loginUser(req, res);
        default:
            res.status(500).send('User proper method');

    }
}

const loginUser = async(req, res) => {
    await 
}