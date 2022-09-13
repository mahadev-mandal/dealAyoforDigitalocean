import { Backdrop, Button, ButtonGroup, CircularProgress, Stack, Typography } from '@mui/material';
import Head from 'next/head';
import React, { useState } from 'react'
import useSWR from 'swr';
import Efficiency from '../../components/Efficiency/Efficiency';
import FullScreenDialog from '../../components/FullScreenDialog/FullScreenDialog';
import AttendanceTable from '../../components/Table/AttendanceTable';
import fetchData from '../../controllers/fetchData';
import handleDateChange from '../../controllers/handleDateChange';
import { baseURL } from '../../helpers/constants';
import { withAuth } from '../../HOC/withAuth';

const tableHeading = ['Date', 'Day', 'Emp Id', 'Name', 'Entry Time', 'Exit Time', 'Assigned', 'Completed', 'Extra', 'Error Tasks', 'Edit'];
const dataHeading = ['dealAyoId', 'name', 'entryTime', 'exitTime', 'tasksAssigned', 'tasksCompleted', 'extraTasksCompleted', 'errorTasks'];

function Attendance() {
    const [dateFrom, setDateFrom] = useState(new Date().setHours(0, 0, 0, 0));
    const [backdropOpen, setBackdropOpen] = useState(false);
    const [activeBtn, setActiveBtn] = useState('today');
    // const [dateTo, setDateTo] = useState(new Date().setHours(24))
    const dateTo = new Date().setHours(24);
    const params = { dateFrom: new Date(dateFrom), dateTo: new Date(dateTo) };

    const { data: attendance, error, mutate } = useSWR(`${baseURL}/api/attendance`, url => fetchData(url, params));

    const handleToday = async () => {
        setBackdropOpen(true)
        setDateFrom(new Date().setHours(0, 0, 0, 0));
        await handleDateChange(params, mutate);
        setBackdropOpen(false)
        setActiveBtn('today')
    }

    const handleThisWeek = async () => {
        setBackdropOpen(true)
        const date = new Date();
        const lastSun = new Date(date.setDate(date.getDate() - date.getDay())).setHours(0, 0, 0, 0);
        setDateFrom(lastSun);
        await handleDateChange(params, mutate)
        setBackdropOpen(false)
        setActiveBtn('thisWeek')
    }
    const handleThisMonth = async () => {
        setBackdropOpen(true)
        const thisYear = new Date().getFullYear();
        const thisMonth = new Date().getMonth(); //month starts from 0-11
        setDateFrom(new Date(thisYear, thisMonth, 1).toLocaleString());
        await handleDateChange(params, mutate)
        setBackdropOpen(false)
        setActiveBtn('thisMonth')
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
                    <FullScreenDialog />
                    <ButtonGroup variant="contained" aria-label="outlined primary button group">
                        <Button
                            variant={activeBtn === 'today' ? 'contained' : 'outlined'}
                            onClick={handleToday}
                        >
                            Today
                        </Button>
                        <Button
                            variant={activeBtn === 'thisWeek' ? 'contained' : 'outlined'}
                            onClick={handleThisWeek}
                        >
                            This Week
                        </Button>
                        <Button
                            variant={activeBtn === 'thisMonth' ? 'contained' : 'outlined'}
                            onClick={handleThisMonth}
                        >
                            This Month
                        </Button>
                        <Button
                            variant={activeBtn === 'customDate' ? 'contained' : 'outlined'}
                            disabled
                        >
                            Custom Date
                        </Button>
                    </ButtonGroup>

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