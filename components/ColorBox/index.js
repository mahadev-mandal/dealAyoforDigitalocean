import { Box, Stack, Typography } from '@mui/material'
import React from 'react'
import PropTypes from 'prop-types';

function ColorBox({ bgColor, label }) {
    return (
        <Stack direction="row" spacing={0.5} alignItems="center">
            <Box sx={{
                height: 20,
                width: 20,
                background: bgColor
            }}></Box><Typography component="span" >{label}</Typography>
        </Stack>
    )
}

ColorBox.propTypes = {
    bgColor: PropTypes.string,
    label: PropTypes.string
}
export default ColorBox