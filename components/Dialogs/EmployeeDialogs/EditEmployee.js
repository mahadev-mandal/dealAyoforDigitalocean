import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { MenuItem, Select, TextField, Typography } from '@mui/material';
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
            await axios.put(`${baseURL}/api/employees/${empDetails._id}`, { ...values, role, level })
                .then(() => {
                    setOpen(false);
                    setMsg('');
                    resetForm();
                    mutate(`${baseURL}/api/employees`)
                }).catch((err) => {
                    setMsg(err.response.data)
                })
        }
    })

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