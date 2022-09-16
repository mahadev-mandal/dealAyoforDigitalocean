import db_conn from "../../../helpers/db_conn";
import productUpdateModel from '../../../models/productUpdateSchema';
import updateTasksModel from '../../../models/updateTasksSchema';
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
            return { tid: p._id, updateStatus: p.updateStatus, errorTask: p.errorTask }
        })
        
        const tasksId = await updateTasksModel.estimatedDocumentCount() + 1;

        const newTask = new updateTasksModel({
            taskId: tasksId,
            date: req.body.assignDate,
            assignToDealAyoId: req.body.assignToDealAyoId,
            assignToName: req.body.assignToName,
            tasks: tasks, //productId, updateStatus, errorTask, disabled
        });
        await newTask.save();
        // const checkTasksId = await productUpdateModel.countDocuments({ tasksId: req.body.tasksId });

        const assignedTasks = await productUpdateModel.updateMany({ _id: req.body.selected }, {
            $set: {
                assignDate: req.body.assignDate,
                assignToDealAyoId: req.body.assignToDealAyoId,
                assignToName: req.body.assignToName,
            },
        }, { new: true })

        res.send(assignedTasks);
    } catch (err) {
        console.log(err)
        res.status(500).send('Error occured while assigning tasks')
    }
}