import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import React from 'react'
import PropTypes from 'prop-types';
import { useContext } from 'react';
import { UserContext } from '../../../context/UserProvider';

function FilterByEmp({ onChange, toEmp, employees, disabled, width, visibleFor }) {
    const user = useContext(UserContext);
    if (visibleFor.length == 0 || visibleFor.includes(user.role)) {
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
                            <MenuItem value={emp.dealAyoId} key={emp.dealAyoId}>{`${emp.firstName} ${emp.lastName}`}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </div>
        )

    }else{
        return null
    }
}

FilterByEmp.propTypes = {
    onChange: PropTypes.func,
    toEmp: PropTypes.string.isRequired,
    employees: PropTypes.array,
    disabled: PropTypes.bool,
    width: PropTypes.string,
    visibleFor: PropTypes.array,
}
FilterByEmp.defaultProps = {
    visibleFor: [],
}
export default FilterByEmp