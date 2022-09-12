import { Button, TextareaAutosize, } from '@mui/material'
import PropTypes from 'prop-types';
import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import axios from 'axios';
import { baseURL } from '../../helpers/constants';
import { useRouter } from 'next/router';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function CommentModal({ onChange, value, endWork }) {
    const router = useRouter();
    const [open, setOpen] = React.useState(false);

    const { tid } = router.query;

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleSaveComment = async () => {
        await axios.post(`${baseURL}/api/tasks/${tid}`, { comment: value })
            .then(() => setOpen(false))
    }

    return (
        <div>
            <Button variant="outlined" disabled={endWork} onClick={handleClickOpen}>
                Write Comment
            </Button>
            <Dialog
                open={open}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClose}
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle>{"Write Beatiful Comment"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                        <TextareaAutosize
                            minRows={3}
                            placeholder="Write comment"
                            style={{ width: 500, margin: '10px 0', }}
                            value={value}
                            onChange={e => onChange(e)}
                        />
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleSaveComment}>Save</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
CommentModal.propTypes = {
    onChange: PropTypes.func,
    value: PropTypes.string,
    endWork: PropTypes.bool,
}