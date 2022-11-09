import { Button, ButtonGroup } from '@mui/material'
import React from 'react';
import PropTypes from 'prop-types';
import CustomDate from './CustomDate';

function FilterByDate({ onClick, activeBtn, }) {
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <>
            <ButtonGroup variant="contained" aria-label="outlined primary button group">
                <Button
                    variant={activeBtn === 'today' ? 'contained' : 'outlined'}
                    onClick={() => onClick('today')}
                >
                    Today
                </Button>
                <Button
                    variant={activeBtn === 'thisWeek' ? 'contained' : 'outlined'}
                    onClick={() => onClick('thisWeek')}
                >
                    This Week
                </Button>
                <Button
                    variant={activeBtn === 'prevWeek' ? 'contained' : 'outlined'}
                    onClick={() => onClick('prevWeek')}
                >
                    Prev Week
                </Button>
                <Button
                    variant={activeBtn === 'thisMonth' ? 'contained' : 'outlined'}
                    onClick={() => onClick('thisMonth')}
                >
                    This Month
                </Button>
                <Button
                    variant={activeBtn === 'customDate' ? 'contained' : 'outlined'}
                    onClick={handleClickOpen}
                >
                    Custom Date
                </Button>
            </ButtonGroup >
            <CustomDate
                open={open}
                handleClose={handleClose}
                handleApply={(cd, df, dt) => onClick(cd, df, dt).then((r) => setOpen(r))}
            />
        </>
    )
}

FilterByDate.propTypes = {
    activeBtn: PropTypes.string,
    onClick: PropTypes.func
}

const isEqual = (prevProps, nextProps) => prevProps.activeBtn == nextProps.activeBtn

export default React.memo(FilterByDate, isEqual)