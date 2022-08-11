import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { MenuItem, Select, TextField, Typography } from '@mui/material';
import { useFormik } from 'formik';
import { employeeValidationSchema } from '../../utils/validationSchema';
import axios from 'axios';
import { baseURL } from '../../helpers/constants';
import { mutate } from 'swr';


const arr = [
    { label: 'dealAyoId', type: 'text' },
    { label: 'firstName', type: 'text' },
    { label: 'lastName', type: 'text' },
    { label: 'mobile', type: 'text' },
    { label: 'email', type: 'email' },
    { label: 'startTime', type: 'text' },
    { label: 'endTime', type: 'text' },
    { label: 'password', type: 'password' },
    { label: 'decreaseTask', type: 'number' }
]

export default function AddEmployee() {
    const [open, setOpen] = React.useState(false);
    const [msg, setMsg] = React.useState('');
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
            role: 'data-entry',
            startTime: '',
            endTime: '',
            password: '',
            decreaseTask: 0
        },
        validationSchema: employeeValidationSchema,
        async onSubmit() {
            await axios.post(`${baseURL}/api/employees`, values)
                .then(() => {
                    setOpen(false);
                    setMsg('');
                    mutate(`${baseURL}/api/employees`)
                }).catch((err) => {
                    setMsg(err.response.data)
                })
        }
    })

    return (
        <div>
            <Button variant="outlined" onClick={handleClickOpen} sx={{ m: 1 }}>
                Add Employee
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
                        value={values.role}
                        onChange={handleChange}
                        onBlur={handleBlur}
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
