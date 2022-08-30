import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import PropTypes from 'prop-types';
import { IconButton, TextareaAutosize, } from '@mui/material';
import RateReviewIcon from '@mui/icons-material/RateReview';
import { baseURL } from '../../helpers/constants';
import axios from 'axios';


export default function Remarks({ title, _id, remarks }) {
    const [open, setOpen] = React.useState(false);
    const [newRemarks, setNewRemarks] = React.useState(remarks)

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleRemarksSave = async () => {
        await axios.put(`${baseURL}/api/products/${_id}`, { remarks: newRemarks })
            .then(() => setOpen(false))
            .catch((err) => { throw new Error(err) })
    }

    return (
        <div>
            <IconButton variant="outlined" onClick={handleClickOpen} size="small" sx={{ padding: 0 }}>
                <RateReviewIcon />
            </IconButton>
            <Dialog
                open={open}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                sx={{
                    "& .MuiDialog-container": {
                        "& .MuiPaper-root": {
                            minWidth: 700
                        },
                    },
                }}
            >
                <DialogTitle id="alert-dialog-title">
                    {title}
                </DialogTitle>
                <DialogContent>
                    <TextareaAutosize
                        aria-label="empty textarea"
                        minRows={4}
                        placeholder="Write remarks"
                        value={newRemarks}
                        onChange={e => setNewRemarks(e.target.value)}
                        style={{ width: '100%' }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleRemarksSave}>Save</Button>
                    <Button onClick={handleClose}>Close</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

Remarks.propTypes = {
    _id: PropTypes.string,
    title: PropTypes.string,
    remarks: PropTypes.string,
}