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
import uploadFileModel from '../../../models/uploadFileSchema';

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

apiRoute.post(async (req, res) => {
  console.log(req.files)
    try {
        let newFile = new uploadFileModel({
            fileName: req.files[0].filename,
            file_url: req.files[0].path,
            workType: 'update',
            supplier: req.body.supplier,
            additionalDetails: req.body.additionalDetails,
        });
        await newFile.save();
        res.send('file uploaded');
    } catch (err) {
        console.log(err);
        res.status(500).send('Error occured while uplaoding file');
    }
});

export default apiRoute;

export const config = {
    api: {
        bodyParser: false, // Disallow body parsing, consume as stream
    },
};


// import uploadFileModel from '../../../models/uploadFileSchema';
// import multer from "multer";
// import { v2 as cloudinary } from "cloudinary";
// // import dotenv from "dotenv";
// import streamifier from "streamifier";
// // dotenv.config();
// const storage = multer.memoryStorage();
// const upload = multer({ storage });
// const uploadMiddleware = upload.single("theFiles");
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
//   secure: true,
// });
// function runMiddleware(req, res, fn) {
//   return new Promise((resolve, reject) => {
//     fn(req, res, (result) => {
//       if (result instanceof Error) {
//         return reject(result);
//       }
//       return resolve(result);
//     });
//   });
// }
// export default async function handler(req, res) {
//   await runMiddleware(req, res, uploadMiddleware);
//   //   console.log(req.file.buffer);
//   const stream = await cloudinary.uploader.upload_stream(
//     {
//       folder: "dealAyoFiles",
//     },
//     async (error, result) => {
//       console.log(req.file.originalname)
//       if (error) return console.error(error);
//       let newFile = new uploadFileModel({
//         fileName: req.file.originalname,
//         file_url: result.secure_url,
//         workType: req.body.workType,
//         supplier: req.body.supplier,
//         additionalDetails: req.body.additionalDetails,
//       });
//       await newFile.save().then(() => {
//         res.status(200).send('File uploaded and informations saved');
//       }).catch((err) => {
//         if (err.keyPattern.fileName) {
//           res.status(500).send('Same file name already exists, to upload change filename')
//         } else {
//           res.status(500).send('Error occured while saving information')
//         }
//       })
//     }
//   );
//   streamifier.createReadStream(req.file.buffer).pipe(stream);
// }
// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };