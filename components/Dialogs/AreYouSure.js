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

export default function AreYourSure({ title, selected, handleClickYes, open, onOpen, onClose }) {
    return (
        <div>
            <Button
                variant="contained"
                color="error"
                disabled={selected.length >= 1 ? false : true}
                onClick={onOpen}
            >
                <DeleteForeverIcon />Delete {selected.length}
            </Button>
            <Dialog
                open={open && selected.length > 0}
                TransitionComponent={Transition}
                keepMounted
                onClose={onClose}
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle>{title}</DialogTitle>
                <DialogActions>
                    <Button onClick={onClose}>No</Button>
                    <Button onClick={handleClickYes}>Yes</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
AreYourSure.propTypes = {
    title: PropTypes.string,
    type: PropTypes.string,
    selected: PropTypes.array,
    collName: PropTypes.string,
    handleClickYes: PropTypes.func,
    onClose: PropTypes.func,
    onOpen: PropTypes.func,
    open: PropTypes.bool
}