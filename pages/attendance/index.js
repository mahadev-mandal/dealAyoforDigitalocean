import { Backdrop, CircularProgress, Stack, Typography } from '@mui/material';
import Head from 'next/head';
import React, { useState } from 'react'
import useSWR from 'swr';
import FilterByDate from '../../components/Filter/FilterByDate';
import AddAttendanceDialog from '../../components/Dialogs/FullScreenDialogs/AddAttendace';
import AttendanceTable from '../../components/Table/AttendanceTable';
import fetchData from '../../controllers/fetchData';
import handleDateChangeClick from '../../controllers/handelDateChangeClick';
import handleMutateData from '../../controllers/handleMutateData';
import { baseURL } from '../../helpers/constants';
import { withAuth } from '../../HOC/withAuth';
import FilterByEmp from '../../components/Filter/FilterProducts/FilterByEmp';
import parseJwt from '../../controllers/parseJwt'
import Cookies from 'js-cookie';
import EditAttendance from '../../components/ExtraCells/Dialogs/EditAttendance';
import AddHoliday from '../../components/Dialogs/AddHolidays';

const tableHeading = ['nepali Date','Date','status', 'Entry Time', 'Exit Time', 'late', 'early leave', 'worked', 'break time', 'edit'];
const dataHeading = ['attendanceStatus', 'entryTime', 'exitTime', 'late', 'earlyLeave', 'worked', 'breakTime', ''];

function Attendance() {
    const [dateFrom, setDateFrom] = useState(new Date().setHours(0, 0, 0, 0));
    const [backdropOpen, setBackdropOpen] = useState(false);
    const [activeBtn, setActiveBtn] = useState('today');
    const [dateTo, setDateTo] = useState(new Date().setHours(24))
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(20);
    const [toEmp, setToEmp] = useState('');
    const params = { dateFrom: new Date(dateFrom), dateTo: new Date(dateTo), dealAyoId: toEmp, page, rowsPerPage };

    const {
        data: attendances,
        error,
        mutate
    } = useSWR(`${baseURL}/api/attendance`, url => fetchData(url, params));
    const {
        data: employees,
        error: error1,
    } = useSWR(`${baseURL}/api/employees`, fetchData);

    const handleDateClick = async (d, df, dt) => {
        setBackdropOpen(true)
        const { dateFrom, dateTo, activeBtn } = handleDateChangeClick(d, df, dt)
        setDateFrom(dateFrom);
        setDateTo(dateTo);
        await handleMutateData(`${baseURL}/api/attendance`, params)
        mutate()
        setBackdropOpen(false);
        setActiveBtn(activeBtn)
    }
    const handleChangePage = async (event, newPage) => {
        setPage(parseInt(newPage));
        await handleMutateData(`${baseURL}/api/attendance`, params);
        mutate();
    }
    const handleChangeRowsPerPage = async (event) => {
        setRowsPerPage(parseInt(event.target.value, 10))
        setPage(parseInt(0))
        await handleMutateData(`${baseURL}/api/attendance`, params);
        mutate();
    }
    const handleEmpChange = async (e) => {
        setBackdropOpen(true);
        setToEmp(e.target.value);
        await handleMutateData(`${baseURL}/api/attendance`, params,);
        mutate();
        setBackdropOpen(false);
    }

    if (error || error1) {
        return <div color='red'>Failed to load Attendance</div>
    } else if (!attendances || !employees) {
        return <div>Please wait loading...</div>
    }
    const emp = employees.data.filter((e) => e.dealAyoId == toEmp)
    if (!(parseJwt(Cookies.get('token')).role == 'super-admin')) {
        emp[0] = {
            firstName: parseJwt(Cookies.get('token')).name,
            dealAyoId: parseJwt(Cookies.get('token')).dealAyoId,
        }
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
            >
                <Stack alignItems="center" justifyContent="center" sx={{ mt: 3 }}>
                    <CircularProgress color="secondary" />
                    <Typography variant='h6'>Loading...</Typography>
                </Stack>
            </Backdrop>
            <Stack spacing={1} direction="row" sx={{ mb: 0.5 }} justifyContent="space-between" >
                <Stack direction="row" spacing={1}>
                    {parseJwt(Cookies.get('token')).role == 'super-admin' && <>
                        <AddAttendanceDialog collName="attendance" />
                        <AddHoliday /></>
                    }
                    <FilterByDate
                        activeBtn={activeBtn}
                        onClick={handleDateClick}
                    />
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center">
                    <Typography>Id: {emp.length > 0 && emp[0].dealAyoId}</Typography>
                    <Typography>Name: {emp.length > 0 && emp[0].firstName}</Typography>
                </Stack>
                <Stack>
                    {parseJwt(Cookies.get('token')).role == 'super-admin' &&
                        <FilterByEmp
                            employees={employees.data}
                            toEmp={toEmp}
                            onChange={handleEmpChange}
                            width="150px"
                        />
                    }
                </Stack>
            </Stack>
            <AttendanceTable
                tableHeading={tableHeading}
                data={attendances.data}
                dataHeading={dataHeading}
                page={page}
                rowsPerPage={rowsPerPage}
                totalCount={attendances.totalCount}
                handleChangePage={handleChangePage}
                handleChangeRowsPerPage={handleChangeRowsPerPage}
                ExtraCells={{ edit: EditAttendance }}
            />
        </div>
    )
}

export default withAuth(Attendance)