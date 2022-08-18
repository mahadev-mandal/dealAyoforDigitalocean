import categoryModel from '../../../models/categorySchema';

export default function category(req, res) {
    switch (req.method) {
        case 'PUT':
            return updateCategory(req, res);
        case 'DELETE':
            return deleteCategory(req, res);
        default:
            res.status(405).send('Use proper methods');
    }
}

const updateCategory = async (req, res) => {
    const { catid } = req.query;
    await categoryModel.updateOne({ _id: catid }, {
        $set: {
            time: req.body.time,
        }
    }).then(() => {
        res.status(200).send('Category updated sucessfully');
    }).catch(() => {
        res.status(500).send('Error occured while updating category');
    })
}

const deleteCategory = async(req, res) => {
    const { catid } = req.query;
    await categoryModel.deleteOne({_id:catid})
    .then(()=>{
        res.status(200).send('Category deleted sucessfully')
    }).catch(()=>{
        res.status(500).send('Error occured while deleting category');
    })
}