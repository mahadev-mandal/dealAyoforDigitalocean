import { Button, } from '@mui/material'
import PropTypes from 'prop-types';
import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
// import DialogContent from '@mui/material/DialogContent';
// import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function AreYouSureModal({ title, selected, handleClickYes }) {
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div>
            <Button
                variant="contained"
                color="error"
                disabled={selected.length >= 1 ? false : true}
                onClick={handleClickOpen}
            >
                <DeleteForeverIcon />Delete {selected.length}
            </Button>
            <Dialog
                open={open && selected.length > 0}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClose}
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle>{title}</DialogTitle>
                <DialogActions>
                    <Button onClick={handleClose}>No</Button>
                    <Button onClick={handleClickYes}>Yes</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
AreYouSureModal.propTypes = {
    title: PropTypes.string,
    type: PropTypes.string,
    selected: PropTypes.array,
    collName: PropTypes.string,
    handleClickYes: PropTypes.func,
}