import db_conn from "../../../helpers/db_conn";
import productModel from '../../../models/productSchema';
// import attendanceModel from '../../../models/attendanceSchema';

db_conn();

export default function Tasks(req, res) {
    switch (req.method) {
        case 'POST':
            return AssignTasks(req, res);
        default:
            res.status(500).send('Use proper methods')
    }
}

const AssignTasks = async (req, res) => {
    try {
        const checkTasksId = await productModel.countDocuments({ tasksId: req.body.tasksId });

        if (checkTasksId < 1) {
            const assignedTasks = await productModel.updateMany({ _id: req.body.selected }, {
                $set: {
                    assignDate: req.body.assignDate,
                    assignToDealAyoId: req.body.dealAyoId,
                    assignToName: req.body.name,
                    tasksId: req.body.tasksId
                },
            }, { new: true })

            // await attendanceModel.updateOne({
            //     date: {
            //         "$gte": new Date(req.body.assignDate).setHours(0, 0, 0, 0),
            //         "$lt": new Date(req.body.assignDate).setHours(24)
            //     },
            //     "employees.dealAyoId": req.body.dealAyoId
            // }, {
            //     $set: {
            //         "employees.$.tasksAssigned": assignedTasks.modifiedCount
            //     }
            // })
            res.send(assignedTasks);
        } else {
            res.status(500).send('tasks id already presents');
        }
    } catch (err) {
        res.status(500).send('Error occured while unassigning tasks')
    }
}