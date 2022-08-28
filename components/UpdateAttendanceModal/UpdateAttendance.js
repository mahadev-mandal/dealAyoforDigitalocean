import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { TextField, Typography, } from '@mui/material';
import { baseURL } from '../../helpers/constants';
import { mutate } from 'swr';
import { useState } from 'react';
import PropTypes from 'prop-types';
import EditIcon from '@mui/icons-material/Edit';
import { IconButton } from '@mui/material';
import axios from 'axios';


export default function UpdateAttendance({ date, dealAyoId, entryTime, exitTime }) {
    const [open, setOpen] = React.useState(false);
    const [msg, setMsg] = useState('');
    const [updatedEntryTime, setEntryTime] = useState(entryTime);
    const [updatedExitTime, setExitTime] = useState(exitTime);

    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };
    const d = new Date(date);
    const body = {
        date,
        dealAyoId,
        entryTime: new Date(`${d.getMonth()}/${d.getDate()}/${d.getFullYear()} ` + updatedEntryTime),
        exitTime: new Date(`${d.getMonth()}/${d.getDate()}/${d.getFullYear()} ` + updatedExitTime)
    }

    const handleUpdate = async () => {
        await axios.put(`${baseURL}/api/mark-attendance`, body)
            .then(() => {
                mutate(`${baseURL}/api/attendance`)
                setMsg('')
                setOpen(false)
            }).catch(() => {
                setMsg('Something went wrong');
                setOpen(true)
            })
    }

    return (
        <div>
            <IconButton size="small" onClick={handleClickOpen}>
                <EditIcon />
            </IconButton>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    <Typography textAlign="center" color="red">{msg}</Typography>
                    {"Update entry or Exit time"}
                </DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        variant="outlined"
                        type="text"
                        label="Date"
                        value={new Date(date).toDateString()}
                        // onChange={}
                        sx={{
                            my: 1
                        }}
                    />
                    <TextField
                        fullWidth
                        variant="outlined"
                        type="text"
                        label="Eployee Id"
                        value={dealAyoId}
                        // onChange={}
                        sx={{
                            my: 1
                        }}
                    />
                    <TextField
                        fullWidth
                        variant="outlined"
                        type="time"
                        label="Entry Time"
                        value={updatedEntryTime}
                        onChange={e => setEntryTime(e.target.value)}
                        sx={{
                            my: 1
                        }}
                    />
                    <TextField
                        fullWidth
                        variant="outlined"
                        type="time"
                        label="Exit Time"
                        value={updatedExitTime}
                        onChange={e => setExitTime(e.target.value)}
                        sx={{
                            my: 1
                        }}
                    />

                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button autoFocus onClick={handleUpdate}>
                        Update
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

UpdateAttendance.propTypes = {
    date: PropTypes.string,
    dealAyoId: PropTypes.string,
    entryTime: PropTypes.string,
    exitTime: PropTypes.string,
}
