import {
    Button,
    DialogContent,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Stack,
    TextareaAutosize,
    TextField,
} from '@mui/material'
import PropTypes from 'prop-types';
import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { useState } from 'react';
import axios from 'axios';
import { baseURL } from '../../helpers/constants';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

function AddHoliday() {
    const [open, setOpen] = React.useState(false);
    const [type, setType] = useState('holiday');
    const [details, setDetails] = useState('');
    const [date, setDate] = useState('');
    const [msg, setMsg] = useState('');

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleDateChange = (event) => {
        setDate(event.target.value);
        setMsg('');
    }

    const handleSave = async () => {
        await axios.post(`${baseURL}/api/holidays`, { type, details, date })
            .then(() => {
                console.log('holiday saved');
                setMsg('Saved')
            })
    }

    return (
        <div>
            <Button
                variant="contained"
                color="error"
                onClick={handleClickOpen}
            >
                Add holiday
            </Button>
            <Dialog
                open={open}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClose}
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle>Add Holidays or Saturday</DialogTitle>
                <div style={{ color: 'green', textAlign: 'center' }}>{msg}</div>
                <DialogContent>
                    <Stack spacing={1} sx={{ m: 1, minWidth: 300 }}>
                        <TextField

                            type="date"
                            variant='outlined'
                            size="small"
                            value={date}
                            onChange={handleDateChange}
                        />
                        <FormControl fullWidth size="small">
                            <InputLabel id="demo-simple-select-label">Type</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={type}
                                label="Type"
                                onChange={e => setType(e.target.value)}
                            >
                                {/* <MenuItem value="saturday">Saturday</MenuItem> */}
                                <MenuItem value="holiday">Holiday</MenuItem>
                            </Select>
                        </FormControl>
                        <TextareaAutosize
                            value={details}
                            onChange={e => setDetails(e.target.value)}
                            minRows={3}
                            placeholder="Details"
                        />
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Close</Button>
                    <Button onClick={handleSave}>Save</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
AddHoliday.propTypes = {
    title: PropTypes.string,
    type: PropTypes.string,
    selected: PropTypes.array,
    collName: PropTypes.string,
    handleClickYes: PropTypes.func,
}

export default React.memo(AddHoliday)
