import { Button, IconButton, TextareaAutosize, } from '@mui/material'
import PropTypes from 'prop-types';
import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import axios from 'axios';
import { baseURL } from '../../../helpers/constants';
import EditIcon from '@mui/icons-material/Edit';
import { mutate } from 'swr';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function EditComment({ row, disabled }) {
    const [open, setOpen] = React.useState(false);
    const [comment, setComment] = React.useState('');
    const handleClickOpen = () => {
        setOpen(true);
        setComment(row.comment);
    };

    const handleClose = () => {
        setOpen(false);
    };
    const handleSaveComment = async () => {
        await axios.post(`${baseURL}/api/worksheet`, {
            date: row.date,
            comment: comment,
            dealAyoId: row.dealAyoId,
            name:row.name
        }).then(() => {
            mutate(`${baseURL}/api/worksheet`);
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
                <DialogTitle>{"Write clear & understandable Comment"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                        <TextareaAutosize
                            minRows={8}
                            placeholder="Write comment"
                            style={{ width: 500, margin: '10px 0', }}
                            defaultValue={row.comment}
                            onChange={e => setComment(e.target.value)}
                        />
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleSaveComment}>Save</Button>
                    <Button onClick={handleClose}>Close</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
EditComment.propTypes = {
    disabled: PropTypes.bool,
    row: PropTypes.object,
}