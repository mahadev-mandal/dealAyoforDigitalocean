import { FormControl, InputLabel, MenuItem, Select } from '@mui/material'
import React from 'react'
import PropTypes from 'prop-types';

function FilterByStatus({ statusFilter, onChange }) {
    return (
        <>
            <FormControl size="small" fullWidth>
                <InputLabel id="demo-simple-select-label">Status</InputLabel>
                <Select
                    size="small"
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={statusFilter}
                    sx={{ width: 150, }}
                    label="status"
                    onChange={e => onChange(e, 'assign')}
                >
                    <MenuItem value="">None</MenuItem>
                    <MenuItem value="assigned" >Assigned</MenuItem>
                    <MenuItem value="unassigned" >Unassigned</MenuItem>
                    <MenuItem value="entry-done" >Entry Done</MenuItem>
                    <MenuItem value="entry-not-done" >Entry not Done</MenuItem>
                    <MenuItem value="error-tasks" >Error Tasks</MenuItem>

                </Select>
            </FormControl>
        </>
    )
}

FilterByStatus.propTypes = {
    statusFilter: PropTypes.string,
    onChange: PropTypes.func,
}
export default FilterByStatus