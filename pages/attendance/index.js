import { Backdrop, Button, ButtonGroup, CircularProgress, Stack, Typography } from '@mui/material';
import Head from 'next/head';
import React, { useState } from 'react'
import useSWR from 'swr';
import FilterByDate from '../../components/FilterByDate';
import AddAttendanceDialog from '../../components/FullScreenModal/AddAttendaceDialog';
import AttendanceTable from '../../components/Table/AttendanceTable';
import fetchData from '../../controllers/fetchData';
import handleDateChange from '../../controllers/handleDateChange';
import { baseURL } from '../../helpers/constants';
import { withAuth } from '../../HOC/withAuth';

const tableHeading = ['Date', 'Day', 'Emp Id', 'Name', 'status', 'Entry Time', 'Exit Time', 'late', 'early leave', 'worked', 'break time',];
const dataHeading = ['dealAyoId', 'name', 'attendanceStatus', 'entryTime', 'exitTime', 'late', 'earlyLeave', 'worked', 'breakTime'];

function Attendance() {
    const [dateFrom, setDateFrom] = useState(new Date().setHours(0, 0, 0, 0));
    const [backdropOpen, setBackdropOpen] = useState(false);
    const [activeBtn, setActiveBtn] = useState('today');
    const [dateTo, setDateTo] = useState(new Date().setHours(24))
    const params = { dateFrom: new Date(dateFrom), dateTo: dateTo };

    const { data: attendance, error, mutate } = useSWR(`${baseURL}/api/attendance`, url => fetchData(url, params));

    const handleDateClick = async (d) => {
        if (d == 'thisWeek') {
            setBackdropOpen(true);
            const date = new Date();
            const lastSun = new Date(date.setDate(date.getDate() - date.getDay())).setHours(0, 0, 0, 0);
            const commingSat = new Date(date.setDate(new Date(lastSun).getDate() + 6)).setHours(24)
            setDateFrom(lastSun);
            setDateTo(commingSat)
            await handleDateChange(params, mutate, ()=>{})
            setActiveBtn('thisWeek')
            setBackdropOpen(false)
        } else if (d == 'prevWeek') {
            setBackdropOpen(true);
            const date = new Date();
            const prevWeekSun = new Date(date.setDate(date.getDate() - date.getDay() - 7)).setHours(0, 0, 0, 0);
            const prevWeekCommingSat = new Date(date.setDate(new Date(prevWeekSun).getDate() + 6)).setHours(24)
            setDateFrom(prevWeekSun);
            setDateTo(prevWeekCommingSat)
            await handleDateChange(params, mutate, ()=>{})
            setActiveBtn('prevWeek')
            setBackdropOpen(false)
        } else if (d == 'thisMonth') {
            setBackdropOpen(true);
            const thisYear = new Date().getFullYear();
            const thisMonth = new Date().getMonth(); //month starts from 0-11
            setDateFrom(new Date(thisYear, thisMonth, 1));
            setDateTo(new Date(thisYear, thisMonth + 1, 0));
            await handleDateChange(params, mutate, ()=>{});
            setActiveBtn('thisMonth');
            setBackdropOpen(false);
        } else {
            setBackdropOpen(true);
            setDateFrom(new Date().setHours(0, 0, 0, 0));
            setDateTo(new Date().setHours(24));
            await handleDateChange(params, mutate, ()=>{});
            setActiveBtn('today')
            setBackdropOpen(false);
        }
    }


    if (error) {
        return <div color='red'>Failed to load Attendance</div>
    } else if (!attendance) {
        return <div>Please wait loading...</div>
    }
    // var timeStart = new Date("01/05/2007 " + '10:5:6')
    // console.log(new Date(timeStart))
    return (
        <div>
            <Head>
                <title>Tasks By DealAyo</title>
            </Head>
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={backdropOpen}
            // onClick={handleClose}
            >
                <Stack alignItems="center" justifyContent="center" sx={{ mt: 3 }}>
                    <CircularProgress color="secondary" />
                    <Typography variant='h6'>Loading...</Typography>
                </Stack>
            </Backdrop>
            <Stack spacing={1} direction="row" sx={{ mb: 0.5 }} justifyContent="space-between" >
                <Stack direction="row" spacing={1}>
                    <AddAttendanceDialog collName="attendance" />
                    <FilterByDate
                        activeBtn={activeBtn}
                        onClick={handleDateClick}
                    />

                </Stack>
            </Stack>
            <AttendanceTable
                tableHeading={tableHeading}
                data={attendance.length < 1 ? [] : attendance}
                dataHeading={dataHeading}
            />
        </div>
    )
}

export default withAuth(Attendance)