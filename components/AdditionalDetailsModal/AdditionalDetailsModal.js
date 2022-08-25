import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import PropTypes from 'prop-types';
import { IconButton, Typography } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';

export default function AdditionalDetailsModal({ title, additionalDetails }) {
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div>
            <IconButton variant="outlined" onClick={handleClickOpen} size="small" sx={{ padding: 0 }}>
                <VisibilityIcon />
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
                    <ul >
                        {Object.keys(additionalDetails).map((objKey) => (
                            <li key={objKey}>
                                <Typography component="span">{[objKey]}</Typography>: <Typography component="span">{additionalDetails[objKey]}</Typography>
                            </li>
                        ))}
                    </ul>

                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Close</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

AdditionalDetailsModal.propTypes = {
    additionalDetails: PropTypes.object,
    title: PropTypes.string,
}