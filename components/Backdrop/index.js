import React from 'react'
import PropTypes from 'prop-types';
import { CircularProgress, Stack, Typography } from '@mui/material';

function Backdrop({ backdropOpen, loadingText }) {
    return (
        <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={backdropOpen}
            // onClick={handleClose}
        >
            <Stack alignItems="center" justifyContent="center" sx={{ mt: 3 }}>
                <CircularProgress color="secondary" />
                <Typography variant='h6'>{loadingText}</Typography>
            </Stack>
        </Backdrop>
    )
}

Backdrop.propTypes = {
    backdropOpen: PropTypes.bool,
    loadingText: PropTypes.string,
}

export default Backdrop