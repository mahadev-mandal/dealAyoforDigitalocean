import { Button, Stack } from '@mui/material';
import axios from 'axios';
import Cookies from 'js-cookie';
import React, { useState } from 'react'
import useSWR from 'swr';
import AttendanceTable from '../../components/Table/AttendanceTable';
import handleDateChange from '../../controllers/handleDateChange';
import { baseURL } from '../../helpers/constants';

const tableHeading = ['Date', 'Day', 'Emp Id', 'Name', 'Entry Time', 'Exit Time', 'Tasks Assigned', 'Tasks Completed', 'Extra Tasks'];
const dataHeading = ['dealAyoId', 'name', 'entryTime', 'exitTime', 'tasksAssigned', 'tasksCompleted', 'extraTasksCompleted'];

function Attendance() {
    const [dateFrom, setDateFrom] = useState(new Date().setHours(0, 0, 0, 0));
    // const [dateTo, setDateTo] = useState(new Date().setHours(24))
    const token = Cookies.get('token');
    const dateTo = new Date().setHours(24);
    const fetchData = async (url) => {
        return await axios.post(url, { dateFrom, dateTo, token })
            .then((res) => res.data).catch((err) => { throw new Error(err) })
    }

    const { data: attendance, error, mutate } = useSWR(`${baseURL}/api/attendance`, fetchData,);

    const handleToday = () => {
        setDateFrom(new Date().setHours(0, 0, 0, 0));
        handleDateChange(dateFrom, dateTo, token, mutate);
    }

    const handleThisWeek = () => {
        const date = new Date();
        const lastSun = new Date(date.setDate(date.getDate() - date.getDay())).setHours(0, 0, 0, 0);
        setDateFrom(lastSun);
        handleDateChange(dateFrom, dateTo, token, mutate);
    }
    const handleThisMonth = () => {
        const thisYear = new Date().getFullYear();
        const thisMonth = new Date().getMonth(); //month starts from 0-11
        setDateFrom(new Date(thisYear, thisMonth, 1).toLocaleString());
        handleDateChange(dateFrom, dateTo, token, mutate)
    }

    if (error) {
        return <div color='red'>Failed to load Attendance</div>
    } else if (!attendance) {
        return <div>Please wait loading...</div>
    }

    return (
        <div>
            <Stack spacing={1} direction="row" sx={{ mb: 0.5 }}>
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
            <AttendanceTable
                tableHeading={tableHeading}
                data={attendance.length < 1 ? [] : attendance}
                dataHeading={dataHeading}
            />
        </div>
    )
}

export default Attendance