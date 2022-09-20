import db_conn from '../../../helpers/db_conn';
import worksheetModel from '../../../models/worksheetSchema';
// import jwt from 'jsonwebtoken';
import tokenPayload from '../../../controllers/tokenPayload';

db_conn();

export default function verifyToken(req, res) {
    switch (req.method) {
        case 'GET':
            return getWorkSheet(req, res);
        case 'POST':
            return saveOrUpdateWorksheet(req, res);
        default:
            res.status(404).send('use proper method');
    }
}

const saveOrUpdateWorksheet = async (req, res) => {
    try {
        const foundWorksheet = await worksheetModel.find({
            date: {
                "$gte": new Date().setHours(0, 0, 0, 0),
                "$lt": new Date().setHours(24)
            }
        })

        const updateWorksheet = async (req, res, found) => {
            if (found[0].employees.find(e => e.dealAyoId === tokenPayload(req.cookies.token).dealAyoId)) {
                await worksheetModel.updateOne({
                    date: {
                        "$gte": new Date().setHours(0, 0, 0, 0),
                        "$lt": new Date().setHours(24)
                    },
                    "employees.dealAyoId": tokenPayload(req.cookies.token).dealAyoId
                }, {
                    $set: {
                        "employees.$.name": tokenPayload(req.cookies.token).name,
                        "employees.$.comment": req.body.comment,
                    }
                })
            } else {

                await worksheetModel.findOneAndUpdate({
                    date: {
                        "$gte": new Date(new Date().setHours(0, 0, 0, 0)),
                        "$lt": new Date().setHours(24)
                    }
                }, {
                    $push: {
                        employees: {
                            dealAyoId: tokenPayload(req.cookies.token).dealAyoId,
                            name: tokenPayload(req.cookies.token).name,
                            comment: req.body.comment,
                        }
                    }
                })
            }
        }
        const saveWorksheet = async (req) => {
            const worksheet = new worksheetModel({
                date: new Date().setHours(0, 0, 0, 0),
                employees: [
                    {
                        dealAyoId: tokenPayload(req.cookies.token).dealAyoId,
                        name: tokenPayload(req.cookies.token).name,
                        comment: req.body.comment,
                    }
                ]
            })
            await worksheet.save()
        }

        if (foundWorksheet.length > 0) {
            updateWorksheet(req, res, foundWorksheet);
        } else {
            saveWorksheet(req, res);
        }
        res.send('worksheet saved')
    } catch (err) {
        res.status(500).send('Error in worksheet');
    }
}


const getWorkSheet = async (req, res) => {
    const { dateFrom, dateTo } = req.query;
    console.log(req.query)
    try {
        let data;
        if (tokenPayload(req.cookies.token).role == 'super-admin') {
            data = await worksheetModel.find({
                date: {
                    $gte: new Date(dateFrom),
                    $lt: new Date(dateTo),
                }
            }).sort({ date: -1 })
        } else {
            data = await worksheetModel.find(
                {
                    date: {
                        $gte: new Date(dateFrom),
                        $lt: new Date(dateTo),
                    },
                    'employees.dealAyoId': tokenPayload(req.cookies.token).dealAyoId
                },
                {
                    date: 1,
                    'employees.$': 1
                }

            ).sort({ date: -1 });
        }
        res.json({ data });
    } catch (err) {
        console.log(err)
        res.status(500).send('Error while fetching worksheet')
    }
}