import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { Box, LinearProgress, Stack, Typography } from '@mui/material';
import axios from 'axios';
import { baseURL } from '../../helpers/constants';
// import { baseURL } from '../../helpers/constants';

export default function UploadFileDialog() {
    const [open, setOpen] = React.useState(false);
    const [files, setFile] = React.useState({});
    const [progress, setProgress] = React.useState(0);
    const [errMsg, setErrMsg] = React.useState(null);
    const [msg, setMsg] = React.useState('');

    const handleClickOpen = () => {
        setOpen(true);
        setFile({})
    };

    const handleClose = () => {
        setOpen(false);
        setFile({});
        setMsg('')
    };

    const handleFileChange = (event) => {
        setErrMsg(null)
        setProgress(0);
        setMsg('')
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
        setErrMsg(null)
        setMsg('')
        const formData = new FormData();
        formData.append('theFiles', files[0]);
        await axios.post(`${baseURL}/api/product-update/upload`, formData,
            {
                headers: { 'content-type': 'multipart/form-data' },
                onUploadProgress: (event) => {
                    setProgress(Math.round((event.loaded * 100) / event.total))
                },
            }).then((r) => {
                setMsg(r.data);
                setErrMsg(null)
            }).catch((err) => {
                setErrMsg(err.response.data)
                console.log(err)
            })
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
                    <Typography variant="body2" textAlign="center" color='red'>{errMsg}{msg}</Typography>
                </DialogTitle>
                <DialogContent sx={{ minWidth: 460 }}>
                    <input
                        type="file"
                        id=""
                        onChange={handleFileChange}
                        name="theFiles"
                        accept="image/jpeg,image/gif,image/png,application/pdf"
                    />
                    <Stack spacing={1} sx={{ mt: 2 }}>
                        {Object.keys(files).map((key) => (
                            <Box key={files[key].name} sx={{ border: '2px dashed gray', p: 1 }}>
                                <Typography variant="body1">{files[key].name}</Typography>
                                <LinearProgress
                                    sx={{ height: 10, }}
                                    value={progress}
                                    variant="determinate"
                                />
                            </Box>
                        ))}
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button disabled={!Object.keys(files).length > 0} onClick={handleUploadClick} autoFocus>
                        Upload
                    </Button>
                    <Button onClick={handleClose}>Close</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
