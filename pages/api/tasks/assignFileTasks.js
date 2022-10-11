import db_conn from "../../../helpers/db_conn";
import uploadFileModel from '../../../models/uploadFileSchema';
import fileTasks from '../../../models/fileTasksSchema';
import employeeModel from '../../../models/employeeSchema';
// import attendanceModel from '../../../models/attendanceSchema';

db_conn();

export default function Tasks(req, res) {
    switch (req.method) {
        case 'POST':
            return AssignFileTask(req, res);
        default:
            res.status(500).send('Use proper methods')
    }
}

const AssignFileTask = async (req, res) => {

    try {
        const tasks = req.body.selected.map((p) => {
            return {
                tid: p._id,
                totalTasks: p.totalTasks,
                completed: p.completed,
                error: p.error,
                status: p.status
            }
        })
        const tasksId = await fileTasks.estimatedDocumentCount() + 1;

        const employee = await employeeModel.findOne({ dealAyoId: req.body.assignToEmp })

        const newTask = new fileTasks({
            taskId: tasksId,
            date: req.body.assignDate,
            type: 'update',
            time:req.body.time,
            assignToDealAyoId: employee.dealAyoId,
            assignToName: employee.firstName,
            tasks: tasks, //productId, entryStatus, errorTask, disabled
        });
        await newTask.save();
        // const checkTasksId = await productModel.countDocuments({ tasksId: req.body.tasksId });

        const assignedTasks = await uploadFileModel.updateMany({ _id: req.body.selected }, {
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