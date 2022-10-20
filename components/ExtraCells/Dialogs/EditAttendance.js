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
import parseJwt from '../../../controllers/parseJwt';
import Cookies from 'js-cookie';
import { useState } from 'react';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function EditAttendance({ row, disabled }) {
    const [open, setOpen] = React.useState(false);
    const [attendanceStatus, setAttendanceStatus] = React.useState('');
    const [entryTime, setEntryTime] = useState(row.entryTime);
    const [exitTime, setExitTime] = useState(row.exitTime);
    const [worked, setWorked] = useState(row.worked)

    const handleClickOpen = () => {
        setOpen(true);
        setAttendanceStatus(row.attendanceStatus);
    };

    const handleClose = () => {
        setOpen(false);
    };
    const handleSaveAttendance = async () => {
        await axios.put(`${baseURL}/api/attendance`, {
            date: row.date,
            attendanceStatus,
            entryTime,
            exitTime,
            worked,
            dealAyoId: row.dealAyoId,
        }).then(() => {
            mutate(`${baseURL}/api/attendance`);
            setOpen(false)
        })
    }
    const showEdit = () => {
        if ((parseJwt(Cookies.get('token')).role == 'super-admin')) {
            if (row.type == 'saturday' || row.type=='holiday' ) {
                return false
            }else{
                return true
            }
        } else {
            return false
        }
    }
    return (
        <div>
            {showEdit() ?
                <IconButton size="small"
                    disabled={disabled}
                    onClick={handleClickOpen}
                    sx={{ p: 0, }}
                >
                    <EditIcon />
                </IconButton>
                : ''
            }
            <Dialog
                open={open}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClose}
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle>{"Edit Attendance"}</DialogTitle>
                <DialogContent>
                    <Stack spacing={1.5} sx={{ width: 300 }}>
                        <TextField
                            disabled
                            variant="outlined"
                            size="small"
                            value={new Date(row.date).toDateString()}
                        />
                        <TextField
                            label="Status"
                            variant="outlined"
                            size="small"
                            value={attendanceStatus}
                            onChange={e => setAttendanceStatus(e.target.value)}
                        />
                        <TextField
                            label="entryTime"
                            variant="outlined"
                            size="small"
                            value={entryTime}
                            onChange={e => setEntryTime(e.target.value)}
                        />
                        <TextField
                            label="exitTime"
                            variant="outlined"
                            size="small"
                            value={exitTime}
                            onChange={e => setExitTime(e.target.value)}
                        />
                        <TextField
                            label="worked"
                            variant="outlined"
                            size="small"
                            value={worked}
                            onChange={e => setWorked(e.target.value)}
                        />
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleSaveAttendance}>Save</Button>
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