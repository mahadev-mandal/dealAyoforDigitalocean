// import multer from 'multer';
// import db_conn from '../../../helpers/db_conn';

// db_conn();

export default function productUpdate(req, res) {
    console.log('helll')
    switch (req.method) {
        case 'POST':
            return uploadFiles(req, res);
        default:
            res.status(500).send('use proper method');
    }
}

// const storage = multer.diskStorage({
//     destination:(req, file, cb)=>{
//         cb(null, '/public');
//     },
//     filename: (req, file, cb)=>{
//         cb(null, Date.now()+file.originalname)
//     },
// });

// let upload = multer({
//     storage:storage,
// })

const uploadFiles = async (req, res) => {
    console.log(req.body);
    res.send('hello');
}