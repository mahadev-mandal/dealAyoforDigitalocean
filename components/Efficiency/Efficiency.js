import { Stack, Typography } from '@mui/material'
import PropTypes from 'prop-types';

const effColor = (eff) => {
    if (eff >= 90) {
        return 'green'
    } else if (eff >= 80) {
        return 'olive'
    } else {
        return 'red'
    }
}

function Efficiency({ assigned, completed }) {
    const efficiency = ((completed / assigned) * 100).toFixed(2);
    const getEffColor = ((completed / assigned) * 100).toFixed(0);
    
    return (
        <>
            <Stack direction="row" spacing={2} justifyContent="space-evenly" sx={{ my: 3 }}>
                <Typography component="div" sx={{ background: 'blue', color: 'white', p: '10px 30px' }}>
                    <Typography component="span">Total Assigned: </Typography>
                    <Typography component="span">{assigned}</Typography>
                </Typography>
                <Typography component="div" sx={{ background: 'green', color: 'white', p: '10px 30px' }}>
                    <Typography component="span">Total Completed: </Typography>
                    <Typography component="span">{completed}</Typography>
                </Typography>
                <Typography component="div" sx={{ background: effColor(getEffColor), color: 'white', p: '10px 30px' }}>
                    <Typography component="span">Efficiency: </Typography>
                    <Typography component="span">{efficiency}%</Typography>
                </Typography>
            </Stack>
        </>
    )
}

Efficiency.propTypes = {
    assigned: PropTypes.number,
    completed: PropTypes.number,
}

export default Efficiency