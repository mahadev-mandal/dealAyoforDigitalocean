import nextConnect from 'next-connect';
import multer from 'multer';
// import uploadFileModel from '../../../models/uploadFileSchema';

const upload = multer({
    storage: multer.diskStorage({
        destination: '/profilePic',
        filename: (req, file, cb) => cb(null, `${file.originalname}`),
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
    try {
        // let newFile = new uploadFileModel({
        //     fileName: req.files[0].filename,
        //     path: req.files[0].path,
        //     workType: 'update',
        //     supplier: req.body.supplier,
        //     additionalDetails: req.body.additionalDetails,
        // });
        // await newFile.save();
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