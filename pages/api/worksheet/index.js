import db_conn from '../../../helpers/db_conn';
import worksheetModel from '../../../models/worksheetSchema';
// import jwt from 'jsonwebtoken';
import tokenPayload from '../../../controllers/tokenPayload';
import holidayModel from '../../../models/holidaysSchema';

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
    let dealAyoId = req.body.dealAyoId;
    let name = req.body.name;
    if (!req.body.dealAyoId) {
        dealAyoId = tokenPayload(req.cookies.token).dealAyoId;
        name = tokenPayload(req.cookies.token).name;
    }

    try {
        const foundWorksheet = await worksheetModel.find({
            date: {
                "$gte": new Date(req.body.date).setHours(0, 0, 0, 0),
                "$lt": new Date(req.body.date).setHours(24)
            },
        })

        const updateWorksheet = async (req, res, found) => {
            if (found[0].employees.find(e => e.dealAyoId === dealAyoId)) {
                await worksheetModel.updateOne({
                    date: {
                        "$gte": new Date(req.body.date).setHours(0, 0, 0, 0),
                        "$lt": new Date(req.body.date).setHours(24)
                    },
                    "employees.dealAyoId": dealAyoId
                }, {
                    $set: {
                        "employees.$.comment": req.body.comment,
                    }
                })
            } else {
                await worksheetModel.findOneAndUpdate({
                    date: {
                        "$gte": new Date(req.body.date).setHours(0, 0, 0, 0),
                        "$lt": new Date(req.body.date).setHours(24)
                    }
                }, {
                    $push: {
                        employees: {
                            dealAyoId: dealAyoId,
                            name: name,
                            comment: req.body.comment,
                        }
                    }
                })
            }
        }
        const saveWorksheet = async (req) => {
            const worksheet = new worksheetModel({
                date: new Date(req.body.date).setHours(0, 0, 0, 0),
                employees: [
                    {
                        dealAyoId: dealAyoId,
                        name: name,
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
    let DA;
    const { dateFrom, dateTo, dealAyoId } = req.query;
    if (!(tokenPayload(req.cookies.token).role == 'super-admin')) {
        DA = tokenPayload(req.cookies.token).dealAyoId
    } else {
        DA = dealAyoId
    }
    try {
        let query = {
            date: {
                "$gte": new Date(dateFrom),
                "$lt": new Date(dateTo)
            },
            "employees.dealAyoId": DA
        }


        const holidays = await holidayModel.find({
            date: {
                "$gte": new Date(dateFrom),
                "$lt": new Date(dateTo)
            },
        })

        const data = await worksheetModel.find(
            query,
            {
                date: 1,
                'employees.$': 1
            }
        ).sort({ date: -1 })

        holidays.forEach((item) => {
            var index = data.findIndex(obj => new Date(obj.date).toLocaleDateString() == new Date(item.date).toLocaleDateString());
            if (index != -1) {
                data.splice(index, 1);

            }
            data.push({
                date: item.date,
                type: item.type,
                details: item.details,
                employees: [
                    {
                        dealAyoId: DA
                    }
                ]

            })
        })

        let l = new Date(dateFrom);
        const sunHolidayEmp = ['r11']
        while (l < new Date(dateTo)) {
            if (sunHolidayEmp.includes(DA)) {
                if (new Date(l).getDay() == 5) {
                    data.push({
                        date: l,
                        type: 'saturday',
                        details: 'Sunday',
                        employees: [
                            {
                                dealAyoId: DA
                            }
                        ]
                    })
                }
            }
            if (new Date(l).getDay() == 4) {
                data.push({
                    date: l,
                    type: 'saturday',
                    details: 'Saturday',
                    employees: [
                        {
                            dealAyoId: DA
                        }
                    ]
                })
            }
            let nd = l.setDate(l.getDate() + 1);
            l = new Date(nd)
        }

        var index = data.findIndex(obj => new Date(obj.date).toLocaleDateString() == new Date().toLocaleDateString());
        if (index === -1) {
            data.push({
                date: new Date(),
                employees: [
                    {
                        dealAyoId: DA
                    }
                ]
            })
        }

        res.json({ data: data.filter((d) => new Date(d.date) <= new Date()) });
    } catch (err) {
        console.log(err)
        res.status(500).send('Error while fetching worksheet')
    }
}