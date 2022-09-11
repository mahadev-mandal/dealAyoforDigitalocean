import db_conn from "../../../helpers/db_conn";
// import productModel from '../../../models/productSchema';
import tasksModel from '../../../models/tasksSchema';
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
        await tasksModel.estimatedDocumentCount() + 1;
        // const taskId = 3

        const newTask = new tasksModel({
            taskId: req.body.tasksId,
            date: req.body.assignDate,
            assignToDealAyoId: req.body.assignToDealAyoId,
            assignToName: req.body.assignToName,
            tasks: tasks, //productId, entryStatus, errorTask, disabled
        });
       const t= await newTask.save();
        // const checkTasksId = await productModel.countDocuments({ tasksId: req.body.tasksId });
        
            // const assignedTasks = await productModel.updateMany({ _id: req.body.selected }, {
            //     $set: {
            //         assignDate: req.body.assignDate,
            //         assignToDealAyoId: req.body.assignToDealAyoId,
            //         assignToName: req.body.assignToName,
            //         tasksId: req.body.tasksId
            //     },
            // }, { new: true })

            res.send(t);
        console.log(t)
    } catch (err) {
        console.log(err)
        res.status(500).send('Error occured while unassigning tasks')
    }
}