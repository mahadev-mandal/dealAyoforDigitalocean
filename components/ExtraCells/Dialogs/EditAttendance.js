import { Button, IconButton, Stack, TextField, } from '@mui/material'
import PropTypes from 'prop-types';
import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import axios from 'axios';
import { baseURL } from '../../../helpers/constants';
import EditIcon from '@mui/icons-material/Edit';
import { mutate } from 'swr';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function EditAttendance({ row, disabled }) {
    const [open, setOpen] = React.useState(false);
    const [attendanceStatus, setAttendanceStatus] = React.useState('');
    const handleClickOpen = () => {
        setOpen(true);
        setAttendanceStatus(row.attendanceStatus);
    };

    const handleClose = () => {
        setOpen(false);
    };
    const handleSaveComment = async () => {
        await axios.post(`${baseURL}/api/attendance`, {
            date: row.date,
            attendanceStatus,
            dealAyoId: row.dealAyoId,
        }).then(() => {
            mutate(`${baseURL}/api/attendance`);
            setOpen(false)
        })
    }

    return (
        <div>
            <IconButton size="small"
                disabled={disabled}
                onClick={handleClickOpen}
                sx={{ p: 0, }}
            >
                <EditIcon />
            </IconButton>
            <Dialog
                open={open}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClose}
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle>{"Edit Attendance"}</DialogTitle>
                <DialogContent>
                    <Stack spacing={1}>
                        <TextField
                            variant="outlined"
                            size="small"
                            value={new Date(row.date).toDateString()}
                        />
                        <TextField
                            variant="outlined"
                            size="small"
                            defaultValue={row.attendanceStatus}
                        />
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleSaveComment}>Save</Button>
                    <Button onClick={handleClose}>Close</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
EditAttendance.propTypes = {
    disabled: PropTypes.bool,
    row: PropTypes.object,
}