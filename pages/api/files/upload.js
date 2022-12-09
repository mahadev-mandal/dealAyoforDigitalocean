// import nextConnect from 'next-connect';
// import multer from 'multer';
// import uploadFileModel from '../../../models/uploadFileSchema';

// const upload = multer({
//     storage: multer.diskStorage({
//         destination: './public/uploaded-tasks',
//         filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
//     }),
// });

// const apiRoute = nextConnect({
//     onError(error, req, res) {
//         res.status(501).json({ error: `Sorry something Happened! ${error.message}` });
//     },
//     onNoMatch(req, res) {
//         res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
//     },
// });

// apiRoute.use(upload.array('theFiles'));

// apiRoute.post(async (req, res) => {
//     try {
//         let newFile = new uploadFileModel({
//             fileName: req.files[0].filename,
//             path: req.files[0].path,
//             workType: 'update',
//             supplier: req.body.supplier,
//             additionalDetails: req.body.additionalDetails,
//         });
//         await newFile.save();
//         res.send('file uploaded');
//     } catch (err) {
//         console.log(err);
//         res.status(500).send('Error occured while uplaoding file');
//     }
// });

// export default apiRoute;

// export const config = {
//     api: {
//         bodyParser: false, // Disallow body parsing, consume as stream
//     },
// };

import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
// import dotenv from "dotenv";
import streamifier from "streamifier";
// dotenv.config();
const storage = multer.memoryStorage();
const upload = multer({ storage });
const uploadMiddleware = upload.single("file");
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
  secure: true,
});
function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}
export default async function handler(req, res) {
  await runMiddleware(req, res, uploadMiddleware);
  console.log(req.file.buffer);
  const stream = await cloudinary.uploader.upload_stream(
    {
      folder: "dealAyoFiles",
    },
    (error, result) => {
      if (error) return console.error(error);
      res.status(200).json(result);
    }
  );
  streamifier.createReadStream(req.file.buffer).pipe(stream);
}
export const config = {
  api: {
    bodyParser: false,
  },
};