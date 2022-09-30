import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import PropTypes from 'prop-types';
import { IconButton, Typography } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import copyToClipboard from '../../../controllers/copyToClipboard';

export default function AdditionalDetails({ row }) {
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    if (!row.additionalDetails) {
        return ''
    }
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
                    {row.title}
                </DialogTitle>
                <DialogContent>
                    <ul >
                        {Object.keys(row.additionalDetails).map((objKey) => (
                            <li key={objKey}>
                                <Typography component="span" >{[objKey]}</Typography>: &nbsp;
                                <Typography
                                    component="span"
                                    sx={{ fontWeight: 'bold', userSelect: 'all' }}
                                    onClick={(e) => copyToClipboard(e.target.innerText)}>
                                    {row.additionalDetails[objKey]}
                                </Typography>
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

AdditionalDetails.propTypes = {
    row: PropTypes.object,
}