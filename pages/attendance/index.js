import { Button, Stack } from '@mui/material';
import axios from 'axios';
import React, { useState } from 'react'
import useSWR from 'swr';
import Efficiency from '../../components/Efficiency/Efficiency';
import AttendanceTable from '../../components/Table/AttendanceTable';
import handleDateChange from '../../controllers/handleDateChange';
import { baseURL } from '../../helpers/constants';
import { withAuth } from '../../HOC/withAuth';

const tableHeading = ['Date', 'Day', 'Emp Id', 'Name', 'Entry Time', 'Exit Time', 'Assigned', 'Completed', 'Extra', 'Edit'];
const dataHeading = ['dealAyoId', 'name', 'entryTime', 'exitTime', 'tasksAssigned', 'tasksCompleted', 'extraTasksCompleted'];

function Attendance() {
    const [dateFrom, setDateFrom] = useState(new Date().setHours(0, 0, 0, 0));
    // const [dateTo, setDateTo] = useState(new Date().setHours(24))
    const dateTo = new Date().setHours(24);
    const params = { dateFrom: new Date(dateFrom), dateTo: new Date(dateTo) };

    const fetchData = async (url) => {
        return await axios.get(url, { params })
            .then((res) => res.data)
            .catch((err) => { throw new Error(err) })
    }

    const { data: attendance, error, mutate } = useSWR(`${baseURL}/api/attendance`, fetchData,);

    const handleToday = () => {
        setDateFrom(new Date().setHours(0, 0, 0, 0));
        handleDateChange(params, mutate);
    }

    const handleThisWeek = () => {
        const date = new Date();
        const lastSun = new Date(date.setDate(date.getDate() - date.getDay())).setHours(0, 0, 0, 0);
        setDateFrom(lastSun);
        handleDateChange(params, mutate);
    }
    const handleThisMonth = () => {
        const thisYear = new Date().getFullYear();
        const thisMonth = new Date().getMonth(); //month starts from 0-11
        setDateFrom(new Date(thisYear, thisMonth, 1).toLocaleString());
        handleDateChange(params, mutate)
    }

    if (error) {
        return <div color='red'>Failed to load Attendance</div>
    } else if (!attendance) {
        return <div>Please wait loading...</div>
    }
    const returnTotal = () => {
        let assigned = 0;
        let completed = 0;
        attendance.forEach((date) => {
            date.employees.forEach((emp) => {
                assigned += emp.tasksAssigned;
                completed += emp.tasksCompleted;
            })
        })
        return { assigned, completed };
    }
    // var timeStart = new Date("01/05/2007 " + '10:5:6')
    // console.log(new Date(timeStart))

    return (
        <div>
            <Stack spacing={1} direction="row" sx={{ mb: 0.5 }} justifyContent="space-between" >
                <Stack direction="row" spacing={1}>
                    <Button
                        variant='outlined'
                        onClick={handleToday}
                    >
                        Today
                    </Button>
                    <Button variant='outlined' onClick={handleThisWeek}>This Week</Button>
                    <Button variant='outlined' onClick={handleThisMonth}>This Month</Button>
                    <Button variant='outlined' disabled>Custom Date</Button>
                </Stack>
            </Stack>
            <AttendanceTable
                tableHeading={tableHeading}
                data={attendance.length < 1 ? [] : attendance}
                dataHeading={dataHeading}
            />
            <Efficiency
                assigned={returnTotal().assigned}
                completed={returnTotal().completed}
            />
        </div>
    )
}

export default withAuth(Attendance)