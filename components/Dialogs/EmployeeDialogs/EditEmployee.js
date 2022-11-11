import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { Box, LinearProgress, MenuItem, Select, Stack, TextField, Typography } from '@mui/material';
import { useFormik } from 'formik';
import { employeeValidationEditSchema, } from '../../../utils/validationSchema';
import axios from 'axios';
import { baseURL } from '../../../helpers/constants';
import { mutate } from 'swr';
import { useState } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import PropTypes from 'prop-types';


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

export default function EditEmployee({ empDetails, disabled }) {

    const [open, setOpen] = React.useState(false);
    const [msg, setMsg] = React.useState('');
    const [level, setLevel] = React.useState(1);
    const [role, setRole] = useState('data-entry')
    const [progress, setProgress] = useState(0);
    const [workingDays, setWorkingDays] = useState([]);
    const [profilePicPath, setProfilePicPath] = useState();
    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    let { handleSubmit, handleChange, handleBlur, touched, errors, values, resetForm } = useFormik({
        enableReinitialize: true,
        initialValues: {
            dealAyoId: empDetails.dealAyoId,
            firstName: empDetails.firstName,
            lastName: empDetails.lastName,
            mobile: empDetails.mobile,
            email: empDetails.email,
            startTime: empDetails.startTime,
            endTime: empDetails.endTime,
            password: '',
            decreaseTask: empDetails.decreaseTask
        },
        validationSchema: employeeValidationEditSchema,
        async onSubmit() {
            await axios.put(`${baseURL}/api/employees/${empDetails._id}`, {
                ...values, role, level, profilePicPath, workingDays
            }).then(() => {
                setOpen(false);
                setMsg('');
                resetForm();
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
            <Button
                variant="contained"
                disabled={disabled}
                color="primary"
                onClick={handleClickOpen}
            >
                <EditIcon /> Edit
            </Button>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    <Typography textAlign="center" color="red">{msg}</Typography>
                    {"Update Employee"}
                </DialogTitle>
                <DialogContent>
                    <Select
                        fullWidth
                        id='level'
                        defaultValue={empDetails.role}
                        onChange={(e) => setRole(e.target.value)}
                    >
                        <MenuItem value="data-entry">Data entry</MenuItem>
                        <MenuItem value="other">Other</MenuItem>
                        <MenuItem value="admin">admin</MenuItem>
                        <MenuItem value="super-admin">Super admin</MenuItem>
                    </Select>
                    <Select
                        sx={{ my: 1 }}
                        fullWidth
                        id='level'
                        defaultValue={empDetails.level}
                        onChange={(e) => setLevel(e.target.value)}
                    >
                        <MenuItem value={1}>One</MenuItem>
                        <MenuItem value={2}>Two</MenuItem>
                        <MenuItem value={3}>Three</MenuItem>
                        <MenuItem value={4}>Four</MenuItem>
                        <MenuItem value={5}>Five</MenuItem>
                    </Select>
                    <Select
                        multiple
                        displayEmpty
                        sx={{ my: 1 }}
                        fullWidth
                        id='working'
                        placeholder="Working days"
                        defaultValue={empDetails.workingDays ? empDetails.workingDays : []}
                        onChange={(e) => setWorkingDays(e.target.value)}
                        renderValue={(selected) => {
                            if (selected.length === 0) {
                                return <em>Working days</em>;
                            }

                            return selected.join(', ');
                        }}
                    >
                        <MenuItem value="sun">Sunday</MenuItem>
                        <MenuItem value="mon">Monday</MenuItem>
                        <MenuItem value="tue">Tuesday</MenuItem>
                        <MenuItem value="wed">Wednesday</MenuItem>
                        <MenuItem value="thu">Thursday</MenuItem>
                        <MenuItem value="fri">Friday</MenuItem>
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

EditEmployee.propTypes = {
    empDetails: PropTypes.object,
    disabled: PropTypes.bool,
}