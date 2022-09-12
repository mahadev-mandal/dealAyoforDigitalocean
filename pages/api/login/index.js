import db_conn from "../../../helpers/db_conn";
import employeeModel from '../../../models/employeeSchema';
import attendanceModel from '../../../models/attendanceSchema';
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
    try {
        const emp = await employeeModel.findOne({ dealAyoId: req.body.dealAyoId });
        if (emp) {
            const passwordMatch = await bcrypt.compare(req.body.password, emp.password);
            if (passwordMatch) {
                const token = await emp.generateAuthToken(req, res);
                const foundAttendace = await attendanceModel.find({
                    date: {
                        "$gte": new Date().setHours(0, 0, 0, 0),
                        "$lt": new Date().setHours(24)
                    },
                })

                if (foundAttendace.length > 0) {
                    //if empId not found in date, attendance with empId will be pushed to array
                    if (!foundAttendace[0].employees.find(e => e.dealAyoId === emp.dealAyoId)) {
                        await attendanceModel.updateOne({
                            date: {
                                "$gte": new Date().setHours(0, 0, 0, 0),
                                "$lt": new Date().setHours(24)
                            }
                        }, {
                            $push: {
                                employees: {
                                    dealAyoId: emp.dealAyoId,
                                    name: emp.firstName,
                                    entryTime: new Date(),
                                }
                            }
                        })
                    }
                } else {
                    //attence will be saved if no date found
                    const attendance = new attendanceModel({
                        date: new Date(),
                        employees: [
                            {
                                dealAyoId: emp.dealAyoId,
                                name: emp.firstName,
                                entryTime: new Date(),
                            }
                        ]
                    })
                    await attendance.save()
                }
                res.status(200).send(token)
            } else {
                res.status(401).send('Password not matching')
            }
        } else {
            res.status(401).send('You are not registered user')
        }
    } catch (err) {
        console.log(err)
        res.status(500).send('Error occured while loging')
    }
}