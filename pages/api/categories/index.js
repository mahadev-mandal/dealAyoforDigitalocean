import categoryModel from '../../../models/categorySchema';

export default function categories(req, res) {
    switch (req.method) {
        case 'GET':
            return getCategories(req, res);
        case 'POST':
            return saveCategories(req, res);
        default:
            res.status(404).send('please use proper method');
    }
}

const getCategories = async (req, res) => {
    await categoryModel.find()
    .then((categories)=>{
        res.status(200).json(categories)
    }).catch(()=>{
        res.status(500).send('Error occured while fetching categories');
    })
}

const saveCategories = async(req, res) => {
    const categ = new categoryModel({
        category: req.body.category,
        time: req.body.time,
    })
    await categ.save()
    .then(()=>{
        res.status(200).send('category saved sucessfully');
    }).catch(()=>{
        res.staus(500).send('Error occured while saving category');
    })
}
