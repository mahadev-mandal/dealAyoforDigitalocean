// import multer from 'multer';
// import db_conn from '../../../helpers/db_conn';

// db_conn();

// export default function productUpdate(req, res) {
//     switch (req.method) {
//         case 'POST':
//             return uploadFiles(req, res);
//         default:
//             res.status(500).send('use proper method');
//     }
// }

// const storage = multer.diskStorage({
//     destination:(req, file, cb)=>{
//         cb(null, '/public');
//     },
//     filename: (req, file, cb)=>{
//         cb(null, Date.now()+file.originalname)
//     },
// });

// const fileFilter = (req, file, cb)=>{
//     if(file.mimiType=='image/jpeg' || file.mimiType=='image/jpg'){
//         cb(null, true);
//     }else{
//         cb(null, false);
//     }
// }

// let upload = multer({
//     storage:storage,
//     limits:{
//         fileSize:1080*1080*5,
//     },
//     fileFilter:fileFilter
// });



// const uploadFiles = async (req, res) => {
//     try{
//         let uploadFile = upload.single(req.theFiles);
//         console.log(uploadFile)
//         res.send('upload sucess');
//     }catch(err){
//         res.status(500).send('err')
//     }

// }


import nextConnect from 'next-connect';
import multer from 'multer';

const upload = multer({
    storage: multer.diskStorage({
        destination: './public/uploaded-tasks',
        filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
    }),
});

const apiRoute = nextConnect({
    onError(error, req, res) {
        res.status(501).json({ error: `Sorry something Happened! ${error.message}` });
    },
    onNoMatch(req, res) {
        res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
    },
});

apiRoute.use(upload.array('theFiles'));

apiRoute.post((req, res) => {
    console.log(req.body.theFiles)
    res.status(200).json({ data: 'success', body: req.body });
});

export default apiRoute;

export const config = {
    api: {
        bodyParser: false, // Disallow body parsing, consume as stream
    },
};