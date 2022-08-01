import { Checkbox } from '@mui/material';
import React from 'react'
import CustomizedTables from '../../components/Table/Table'

const tableHeading = ['date', 'id', 'name', 'arrival', 'departure', 'status', 'comment'];
const data = [
    {
        date: '2022/02/04',
        id: 'DA11',
        name: 'Mahadev',
        arrival: <Checkbox inputProps={{ 'aria-label': 'controlled' }}/>,
        departure: <Checkbox inputProps={{ 'aria-label': 'controlled' }}/>,
        status: 'P',
        comment: 'optional comment',
    }
]

function Attendance() {
    return (
        <div>
            <CustomizedTables tableHeading={tableHeading} data={data} />
        </div>
    )
}

export default Attendance