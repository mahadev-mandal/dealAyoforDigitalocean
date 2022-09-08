import categoryModel from '../../../models/categorySchema';

export default function categories(req, res) {
    switch (req.method) {
        case 'GET':
            return getCategories(req, res);
        case 'POST':
            return saveCategories(req, res);
        case 'DELETE':
            return deleteCategories(req, res);
        default:
            res.status(404).send('please use proper method');
    }
}

const getCategories = async (req, res) => {
    const { page, rowsPerPage } = req.query;

    const totalCount = await categoryModel.estimatedDocumentCount();
    await categoryModel.find().skip(parseInt(page) * parseInt(rowsPerPage)).limit(parseInt(rowsPerPage))
        .then((categories) => {
            res.status(200).json({ data: categories, totalCount })
        }).catch(() => {
            res.status(500).send('Error occured while fetching categories');
        })
}

const saveCategories = async (req, res) => {
    const categ = new categoryModel({
        category: req.body.category,
        time: req.body.time,
    })
    await categ.save()
        .then(() => {
            res.status(200).send('category saved sucessfully');
        }).catch((err) => {
            if (err.keyPattern.category) {
                res.status(500).send('Category already presents');
            } else {
                res.status(500).send('Error occured while saving category');
            }
        })
}

const deleteCategories = async (req, res) => {
    await categoryModel.deleteMany({ _id: { $in: req.body._ids } })
        .then(() => {
            res.status(200).send('Category deleted sucessfully')
        }).catch(() => {
            res.status(500).send('Error occured while deleting category');
        })
}
