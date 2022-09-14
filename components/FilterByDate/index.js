import { Button, ButtonGroup } from '@mui/material'
import React from 'react';
import PropTypes from 'prop-types';

function FilterByDate({ onClick, activeBtn }) {

    return (
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
                variant={activeBtn === 'thisMonth' ? 'contained' : 'outlined'}
                onClick={() => onClick('thisMonth')}
            >
                This Month
            </Button>
            <Button
                disabled
                variant={activeBtn === 'prevWeek' ? 'contained' : 'outlined'}
                onClick={() => onClick('prevWeek')}
            >
                Prev Week
            </Button>
            <Button
                variant={activeBtn === 'customDate' ? 'contained' : 'outlined'}
                disabled
            >
                Custom Date
            </Button>
        </ButtonGroup>
    )
}

FilterByDate.propTypes = {
    activeBtn: PropTypes.string,
    onClick: PropTypes.func
}

export default FilterByDate