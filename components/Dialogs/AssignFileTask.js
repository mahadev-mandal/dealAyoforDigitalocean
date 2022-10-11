import { Button, DialogContent, InputAdornment, OutlinedInput, Stack, TextField, } from '@mui/material'
import PropTypes from 'prop-types';
import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
// import DialogContent from '@mui/material/DialogContent';
// import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import AssignmentIcon from '@mui/icons-material/Assignment';
import FilterByEmp from '../Filter/FilterProducts/FilterByEmp';
import { useState } from 'react';
import axios from 'axios';
import { baseURL } from '../../helpers/constants';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function AssignFileTask({ selected, employees }) {
    const [open, setOpen] = React.useState(false);
    const [assignToEmp, setAssignToEmp] = useState('');
    const [time, setTime] = useState(0);
    const date = new Date();
    const year = date.getFullYear();
    let month = date.getMonth() + 1;
    month = String("0" + month).slice(-2);
    const day = String("0" + date.getDate()).slice(-2);
    const [assignDate, setAssignDate] = useState(`${year}-${month}-${day}`)

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    const handleAssign = async () => {
        await axios.post(`${baseURL}/api/tasks/assignFileTasks`, {
            assignDate,
            assignToEmp,
            time,
            selected
        }).then(() => {
            setOpen(false)
        })
    }
    return (
        <div>
            <Button
                size="small"
                variant="contained"
                color="warning"
                onClick={handleClickOpen}
                disabled={selected.length >= 1 ? false : true}
            >
                <AssignmentIcon /> Assign {selected.length}
            </Button>
            <Dialog
                open={open && selected.length > 0}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClose}
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle sx={{ maxWidth: 400 }}>
                    {selected.map((item) => (
                        `${item.fileName.substr(item.fileName.indexOf('-') + 1)}, `
                    ))}
                </DialogTitle>
                <DialogContent>
                    <Stack spacing={1} sx={{ p: 1 }}>
                        <FilterByEmp
                            employees={employees}
                            toEmp={assignToEmp}
                            onChange={e => setAssignToEmp(e.target.value)}
                            width="100%"
                        />
                        <TextField
                            type="date"
                            size="small"
                            value={assignDate}
                            onChange={e => setAssignDate(e.target.value)}
                        />
                        <OutlinedInput
                            id="outlined-adornment-Time"
                            size="small"
                            type="number"
                            value={time}
                            onChange={e => setTime(e.target.value)}
                            endAdornment={<InputAdornment position="end">mins</InputAdornment>}
                            inputProps={{
                                'aria-label': 'time',
                            }}
                        />

                    </Stack>

                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Close</Button>
                    <Button onClick={handleAssign}>Assign</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
AssignFileTask.propTypes = {
    selected: PropTypes.array,
    employees: PropTypes.array,
}