import db_conn from '../../../helpers/db_conn';
import worksheetModel from '../../../models/worksheetSchema';
// import jwt from 'jsonwebtoken';
import tokenPayload from '../../../controllers/tokenPayload';
// import employeeModal from '../../../models/employeeSchema';

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
    const { dateFrom, dateTo, dealAyoId } = req.query;
    try {
        let data;
        if (tokenPayload(req.cookies.token).role == 'super-admin') {
            let query = {
                date: {
                    $gte: new Date(dateFrom),
                    $lt: new Date(dateTo),
                },
                'employees.dealAyoId': dealAyoId,
            }
            let abc = {
                date: 1,
                'employees.$': 1
            }
            if (!dealAyoId) {
                delete query['employees.dealAyoId'];
                abc = {};
            }
            data = await worksheetModel.find(
                query,
                abc

            ).sort({ date: -1 })
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
            let l = new Date(dateFrom);
            let i = 0;
            let a = [];
            let dateArr = data.map((d) => {
                return new Date(d.date).toDateString();
            })
            while (l < new Date(dateTo)) {
                // console.log(l)
                if (dateArr.includes(l.toDateString())) {
                    a = [...a, data[i]];
                    // console.log(data[i]);
                } else {
                    a = [...a, { date: l, employees: [] }]
                    // console.log({ date: l, employees: [] })
                }
                l.setDate(l.getDate() + 1);
                i++
            }
            // console.log(new Date(a[0].date).toDateString())
        }
        res.json({ data });
    } catch (err) {
        console.log(err)
        res.status(500).send('Error while fetching worksheet')
    }
}