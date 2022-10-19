import { Button, Stack, } from '@mui/material'
import PropTypes from 'prop-types';
import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import Calendar from '@sbmdkl/nepali-datepicker-reactjs';
import '@sbmdkl/nepali-datepicker-reactjs/dist/index.css';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function CustomDate({ open, handleClose, handleApply }) {
    const date = new Date();
    const year = date.getFullYear();
    let month = date.getMonth() + 1;
    month = String("0" + month).slice(-2);
    const day = String("0" + date.getDate()).slice(-2);
    const [dateFrom, setDateFrom] = React.useState(`${year}-${month}-${day}`)
    const [dateTo, setDateTo] = React.useState(`${year}-${month}-${day}`)
    return (
        <div>
            <Dialog
                sx={{
                    "& .MuiDialog-container": {
                        alignItems: "flex-start",

                    }
                }}
                PaperProps={{ style: { overflowY: 'visible' } }}
                open={open}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClose}
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle>{"Select Date Range"}</DialogTitle>

                <DialogContent style={{ overflowY: 'visible', }} >
                    <Stack alignItems="center" spacing={0.2} >


                        <Calendar language="en" style={{ width: 300 }}
                            onChange={({ adDate }) => setDateFrom(adDate)}
                        />
                        <span>to</span>
                        <Calendar language="en" style={{ width: 300 }}
                            onChange={({ adDate }) => setDateTo(adDate)}
                        />

                        {/* <TextField
                            type="date"
                            variant="outlined"
                            sx={{ mr: 1 }}
                            value={dateFrom}
                            onChange={e => setDateFrom(e.target.value)}
                        />
                        to &nbsp;
                        <TextField
                            type="date"
                            variant="outlined"
                            value={dateTo}
                            onChange={e => setDateTo(e.target.value)}
                        /> */}

                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => handleApply('customDate', dateFrom, dateTo)}>Apply</Button>
                    <Button onClick={handleClose}>Close</Button>
                </DialogActions>
            </Dialog>
        </div >
    );
}
CustomDate.propTypes = {
    handleApply: PropTypes.func,
    handleClose: PropTypes.func,
    open: PropTypes.bool,
}