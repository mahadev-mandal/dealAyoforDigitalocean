import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { LinearProgress, MenuItem, Select, Stack, TextField, Typography } from '@mui/material';
import { useFormik } from 'formik';
import { employeeValidationSchema } from '../../../utils/validationSchema';
import axios from 'axios';
import { baseURL } from '../../../helpers/constants';
import { mutate } from 'swr';
import { useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import PropTypes from 'prop-types';
import { Box } from '@mui/system';


const arr = [
    { label: 'dealAyoId', type: 'text' },
    { label: 'firstName', type: 'text' },
    { label: 'lastName', type: 'text' },
    { label: 'mobile', type: 'text' },
    { label: 'email', type: 'email' },
    { label: 'startTime', type: 'time' },
    { label: 'endTime', type: 'time' },
    { label: 'password', type: 'text' },
    { label: 'decreaseTask', type: 'number' }
]

export default function AddEmployee() {
    const [open, setOpen] = React.useState(false);
    const [msg, setMsg] = React.useState('');
    const [role, setRole] = useState('data-entry')
    const [progress, setProgress] = useState(0);
    const [profilePicPath, setProfilePicPath] = useState();
    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };



    const { handleSubmit, handleChange, handleBlur, touched, errors, values } = useFormik({
        initialValues: {
            dealAyoId: '',
            firstName: '',
            lastName: '',
            mobile: '',
            email: '',
            startTime: '10:00',
            endTime: '18:00',
            password: '',
            decreaseTask: 0
        },
        validationSchema: employeeValidationSchema,
        async onSubmit() {
            await axios.post(`${baseURL}/api/employees`, { ...values, role, profilePicPath })
                .then(() => {
                    setOpen(false);
                    setMsg('');
                    mutate(`${baseURL}/api/employees`)
                }).catch((err) => {
                    setMsg(err.response.data)
                })
        }
    })

    const handleFileChange = async (event) => {
        // setErrMsg(null)
        setProgress(0);
        setMsg('')
        const formData = new FormData();
        const file = event.target.files[0];
        var ext = file.name.substr(file.name.lastIndexOf('.') + 1);
        const fileName = `${values.firstName}_${values.dealAyoId}.${ext}`
        formData.append('theFiles', file, fileName);
        await axios.post(`${baseURL}/api/uploadProfilePic`, formData, {
            headers: { 'content-type': 'multipart/form-data' },
            onUploadProgress: (event) => {
                setProgress(Math.round((event.loaded * 100) / event.total))
            },
        }).then((r) => {
            setMsg(r.data);
            setProfilePicPath(`/profilePic/${fileName}`)
            // setErrMsg(null)
        }).catch((err) => {
            // setErrMsg(err.response.data)
            console.log(err)
        })
    }
    return (
        <div>
            <Button variant="contained" color="success" onClick={handleClickOpen}>
                <AddIcon /> Add
            </Button>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    <Typography textAlign="center" color="red">{msg}</Typography>
                    {"Add Employee"}
                </DialogTitle>
                <DialogContent>
                    <Select
                        fullWidth
                        id='role'
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                    >
                        <MenuItem value="data-entry">Data entry</MenuItem>
                        <MenuItem value="other">Other</MenuItem>
                        <MenuItem value="admin">admin</MenuItem>
                        <MenuItem value="super-admin">Super admin</MenuItem>
                    </Select>
                    {arr.map((item) => (
                        <TextField
                            key={item.label}
                            fullWidth
                            id={item.label}
                            variant="outlined"
                            type={item.type}
                            label={item.label}
                            value={values[item.label]}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={errors[item.label] && touched[item.label] ? true : false}
                            helperText={errors[item.label] && touched[item.label] ? errors[item.label] : null}
                            sx={{
                                my: 1
                            }}
                        />
                    ))}
                    {values.firstName && values.dealAyoId &&
                        <Stack spacing={1} sx={{ mt: 2, border: '2px dashed gray', p: 1 }}>
                            <input
                                type="file"
                                id=""
                                onChange={handleFileChange}
                                name="theFiles"
                                accept="image/jpeg,image/gif,image/png"
                            />
                            {progress > 0 &&
                                <Box>
                                    <LinearProgress
                                        sx={{ height: 10, }}
                                        value={progress}
                                        variant="determinate"
                                    />
                                </Box>
                            }
                        </Stack>
                    }
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleSubmit} autoFocus>
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

AddEmployee.propTypes = {
    initialValues: PropTypes.object
}