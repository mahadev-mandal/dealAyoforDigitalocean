import db_conn from '../../../helpers/db_conn';
import worksheetModel from '../../../models/worksheetSchema';
// import jwt from 'jsonwebtoken';
import tokenPayload from '../../../controllers/tokenPayload';
import employeeModal from '../../../models/employeeSchema';

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
    const { dateFrom, dateTo, dealAyoId } = req.query;
console.log(dateFrom, dateTo)
    try {
        let data;
        let employees;
        if (tokenPayload(req.cookies.token).role == 'super-admin') {
            if (dealAyoId == '') {
                employees = await employeeModal.find({ role: { $ne: 'super-admin' } });
            } else {
                employees = await employeeModal.find({ dealAyoId });
            }
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
            employees = await employeeModal.find({ dealAyoId: tokenPayload(req.cookies.token).dealAyoId });
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

        let l = new Date(dateFrom);
        
        // 1970-01-01T12:00
        let dateArr = [];
        let dataArr = [];
        while (l < new Date(dateTo)) {
            dateArr.push(l.toDateString());
            let nd = l.setDate(l.getDate() + 1);
            l = new Date(nd)
        }
        dateArr.pop();

        let tempDateArr = dateArr;

        data.forEach((d, i) => {
            let tempEmployees = [...employees];
            tempDateArr.splice(tempDateArr.indexOf(new Date(new Date(d.date)).toDateString()), 1);
            dataArr.push({ date: d.date, employees: [] });
            d.employees.forEach((emp) => {
                dataArr[i].employees.push(emp);
                const indx = tempEmployees.findIndex(obj => obj.dealAyoId == emp.dealAyoId);
                if (indx > -1) {
                    tempEmployees.splice(indx, 1)
                }
            })
            tempEmployees.forEach((obj) => {
                dataArr[i].employees.push({ dealAyoId: obj.dealAyoId, name: obj.firstName })
            });

        })

        tempDateArr.forEach((dt) => {
            dataArr.push({
                date: new Date(dt),
                employees: employees.map((emp) => {
                    return { dealAyoId: emp.dealAyoId, name: emp.firstName }
                })
            })
        })
        res.json({ data: dataArr.filter((d) => new Date(d.date) <= new Date()) });
    } catch (err) {
        console.log(err)
        res.status(500).send('Error while fetching worksheet')
    }
}