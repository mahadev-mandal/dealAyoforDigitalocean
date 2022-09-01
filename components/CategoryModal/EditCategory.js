import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { TextField, Typography } from '@mui/material';
import { useFormik } from 'formik';
import { categoryValidationSchema } from '../../utils/validationSchema';
import axios from 'axios';
import { baseURL } from '../../helpers/constants';
import { mutate } from 'swr';
import PropTypes from 'prop-types';
import EditIcon from '@mui/icons-material/Edit';


const arr = [
    { label: 'category', type: 'text' },
    { label: 'time', type: 'text' },
]

export default function EditCategory({ categoryDetails, disabled }) {
    const [open, setOpen] = React.useState(false);
    const [msg, setMsg] = React.useState('');
    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    const { handleSubmit, handleChange, handleBlur, touched, errors, values } = useFormik({
        enableReinitialize: true,
        initialValues: {
            category: categoryDetails.category,
            time: categoryDetails.time,
        },
        validationSchema: categoryValidationSchema,
        async onSubmit() {
            await axios.put(`${baseURL}/api/categories/${categoryDetails._id}`, values)
                .then(() => {
                    setOpen(false);
                    setMsg('');
                    mutate(`${baseURL}/api/categories`)
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
                    {"Add Category"}
                </DialogTitle>
                <DialogContent>

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

EditCategory.propTypes = {
    categoryDetails: PropTypes.object,
    disabled: PropTypes.bool
}