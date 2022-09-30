import db_conn from "../../../helpers/db_conn";
import productModel from '../../../models/productSchema';
import tasksModel from '../../../models/tasksSchema';
import employeeModel from '../../../models/employeeSchema';
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
        const tasks = req.body.selected.map((p) => {
            return { tid: p._id, entryStatus: p.entryStatus, errorTask: p.errorTask, status: p.status }
        })
        const tasksId = await tasksModel.estimatedDocumentCount() + 1;

        const employee = await employeeModel.findOne({ dealAyoId: req.body.assignToEmp })

        const newTask = new tasksModel({
            taskId: tasksId,
            date: req.body.assignDate,
            assignToDealAyoId: employee.dealAyoId,
            assignToName: employee.firstName,
            tasks: tasks, //productId, entryStatus, errorTask, disabled
        });
        await newTask.save();
        // const checkTasksId = await productModel.countDocuments({ tasksId: req.body.tasksId });

        const assignedTasks = await productModel.updateMany({ _id: req.body.selected }, {
            $set: {
                assignDate: req.body.assignDate,
                assignToDealAyoId: employee.dealAyoId,
                assignToName: employee.firstName,
            },
        }, { new: true })

        res.send(assignedTasks);
    } catch (err) {
        console.log(err)
        res.status(500).send('Error occured while unassigning tasks')
    }
}