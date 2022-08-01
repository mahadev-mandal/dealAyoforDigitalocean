import React from 'react'
import CustomizedTables from '../../components/Table/Table'

const tableHeading = ['id', 'mobile', 'email', 'start_time', 'end_time', 'tasks_decr'];
const data = [
    {
        id: 'DA11',
        mobile: '9816876852',
        email: 'mandalmahadev5@gmail.com',
        start_time: '10:00 am',
        end_time: '6:00 am',
        tasks_decr: 0,
    },
    {
        id: 'DA11',
        mobile: '9816876852',
        email: 'mandalmahadev5@gmail.com',
        start_time: '10:00 am',
        end_time: '6:00 am',
        tasks_decr: 0,
    }
]

function Employees() {
  return (
    <div>
        <CustomizedTables tableHeading={tableHeading} data={data} />
    </div>
  )
}

export default Employees