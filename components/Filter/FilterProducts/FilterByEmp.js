import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import React from 'react'
import PropTypes from 'prop-types';

function FilterByEmp({ onChange, toEmp, employees, disabled, width }) {
    return (
        <div>
            <FormControl size="small" fullWidth >
                <InputLabel id="demo-simple-select-label">Employee</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={toEmp}
                    sx={{ width }}
                    label="Assign To"
                    onChange={onChange}
                    disabled={disabled}
                >
                    <MenuItem value=''>None</MenuItem>
                    {employees.map((emp) => (
                        <MenuItem value={emp.dealAyoId} key={emp.dealAyoId}>{emp.firstName}</MenuItem>
                    ))}
                </Select>
            </FormControl>
        </div>
    )
}

FilterByEmp.propTypes = {
    onChange: PropTypes.func,
    toEmp: PropTypes.string,
    employees: PropTypes.array,
    disabled: PropTypes.bool,
    width: PropTypes.string,
}
export default FilterByEmp