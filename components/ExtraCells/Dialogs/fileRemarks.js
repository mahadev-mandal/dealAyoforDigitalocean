import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import PropTypes from 'prop-types';
import { IconButton, TextareaAutosize, } from '@mui/material';
import RateReviewIcon from '@mui/icons-material/RateReview';
import { baseURL } from '../../../helpers/constants';
import axios from 'axios';
import { mutate } from 'swr';
import { useRouter } from 'next/router';


export default function FileRemarks({ row }) {
    const router = useRouter();
    const [open, setOpen] = React.useState(false);
    const [newRemarks, setNewRemarks] = React.useState();
    const { fid } = router.query;

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleRemarksSave = async () => {
        await axios.put(`${baseURL}/api/files/${row._id}`, { remarks: newRemarks })
            .then(() => {
                setOpen(false)
                mutate(`${baseURL}/api/tasks/file-tasks/${fid}`)
            }).catch((err) => { throw new Error(err) })
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
                    {row.title}
                </DialogTitle>
                <DialogContent>
                    <TextareaAutosize
                        aria-label="empty textarea"
                        minRows={4}
                        placeholder="Write remarks"
                        defaultValue={row.remarks}
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

FileRemarks.propTypes = {
    row: PropTypes.object,
}