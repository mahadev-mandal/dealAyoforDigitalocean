import React, { useState } from 'react';
import {
    Box,
    LinearProgress,
    MenuItem,
    Select,
    Stack,
    TextareaAutosize,
    TextField,
    Typography,
    DialogTitle,
    DialogContent,
    DialogActions,
    Dialog,
    Button
} from '@mui/material';
import axios from 'axios';
import { baseURL } from '../../helpers/constants';

export default function UploadFileDialog() {
    const [open, setOpen] = React.useState(false);
    const [files, setFile] = React.useState({});
    const [progress, setProgress] = React.useState(0);
    const [errMsg, setErrMsg] = React.useState(null);
    const [msg, setMsg] = React.useState('');
    const [workType, setWorkType] = useState('update');
    const [supplier, setSupplier] = useState('');
    const [additionalDetails, setAddtionalDetails] = useState('');

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
        formData.append('supplier', supplier);
        formData.append('workType', workType);
        formData.append('additionalDetails', additionalDetails);
        await axios.post(`${baseURL}/api/product-update/upload`, formData, {
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
                    {"Upload Singe file"}
                    <Typography variant="body2" textAlign="center" color='red'>{errMsg}{msg}</Typography>
                </DialogTitle>
                <DialogContent sx={{ minWidth: 460 }}>
                    <Stack spacing={1}>
                        <Select
                            size="small"
                            value={workType}
                            onChange={e => setWorkType(e.target.value)}
                        >
                            <MenuItem value="entry">Product Entry</MenuItem>
                            <MenuItem value="update">Product Update</MenuItem>
                        </Select>
                        <TextField
                            variant="outlined"
                            label="Supplier"
                            size="small"
                            value={supplier}
                            onChange={e => setSupplier(e.target.value)}
                        />
                        <TextareaAutosize
                            minRows={3}
                            placeholder="Additional details"
                            value={additionalDetails}
                            onChange={e => setAddtionalDetails(e.target.value)}
                        />
                        <input
                            accept="image/*"
                            // className={classes.input}
                            style={{ display: 'none' }}
                            id="raised-button-file"
                            multiple
                            type="file"
                        />
                        <Stack spacing={1} sx={{ mt: 2, border: '2px dashed gray', p: 1 }}>
                            <input
                                type="file"
                                id=""
                                onChange={handleFileChange}
                                name="theFiles"
                                accept="image/jpeg,image/gif,image/png,application/pdf"
                            />
                            {Object.keys(files).map((key) => (
                                <Box key={files[key].name}>
                                    <LinearProgress
                                        sx={{ height: 10, }}
                                        value={progress}
                                        variant="determinate"
                                    />
                                </Box>
                            ))}
                        </Stack>
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button disabled={!Object.keys(files).length > 0} onClick={handleUploadClick} autoFocus>
                        Upload&Save
                    </Button>
                    <Button onClick={handleClose}>Close</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
