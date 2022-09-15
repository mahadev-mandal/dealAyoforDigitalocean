import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { Box, LinearProgress, Stack, Typography } from '@mui/material';
import axios from 'axios';
// import { baseURL } from '../../helpers/constants';

export default function UploadFileDialog() {
    const [open, setOpen] = React.useState(false);
    const [files, setFile] = React.useState({});
    const [progress, setProgress] = React.useState(0);
    const [errMsg, setErrMsg] = React.useState(null);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleFileChange = (event) => {
        setErrMsg(null)
        const files = event.target.files;
        const a = Object.keys(files).map((key) => {
            if (files[key].name.length > 30) {
                return false;
            } else {
                return true;
            }
        })
        if (a.every(v => v == true)) {
            setErrMsg(null)
            setFile(event.target.files);
        } else {
            setErrMsg('Some file name length is so long max:30 char')
        }
    }

    const handleUploadClick = async () => {
        const formData = new FormData();
        formData.append('file', files[0])
        await axios.post(`/api/hello`, formData,
            { "Content-Type": "multipart/form-data" },
        ).then((r) => console.log(r))
    }


    return (
        <div>
            <Button variant="outlined" onClick={handleClickOpen}>
                Upload File
            </Button>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Upload multiple or Singe files"}
                    <Typography variant="body2" textAlign="center" color='red'>{errMsg}</Typography>
                </DialogTitle>
                <DialogContent sx={{ minWidth: 460 }}>
                    <input type="file" multiple id="" onChange={handleFileChange} name="file" />
                    <Stack spacing={1} sx={{ mt: 2 }}>
                        {Object.keys(files).map((key) => (
                            <Box key={files[key].name} sx={{ border: '2px dashed gray', p: 1 }}>
                                <Typography variant="body1">{files[key].name}</Typography>
                                <LinearProgress
                                    sx={{ height: 10 }}
                                    value={progress}
                                    variant="determinate"
                                />
                            </Box>
                        ))}
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleUploadClick} autoFocus>
                        Upload
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
