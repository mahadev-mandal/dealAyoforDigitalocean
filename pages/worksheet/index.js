import { Backdrop, CircularProgress, Stack, Typography } from '@mui/material'
import Cookies from 'js-cookie'
import Head from 'next/head'
import React, { useState } from 'react'
import useSWR from 'swr'
import CommentModal from '../../components/Dialogs/Comment';
import FilterByDate from '../../components/Filter/FilterByDate';
import EditComment from '../../components/ExtraCells/Dialogs/EditComment'
import FilterByEmp from '../../components/Filter/FilterProducts/FilterByEmp'
import AttendanceTable from '../../components/Table/AttendanceTable'
import fetchData from '../../controllers/fetchData'
import handleDateChangeClick from '../../controllers/handelDateChangeClick'
import handleMutateData from '../../controllers/handleMutateData'
import parseJwt from '../../controllers/parseJwt'
import { baseURL } from '../../helpers/constants'

const tableHeading = ['date', 'day', 'name', 'Id', 'comment', 'edit'];
const dataHeading = ['name', 'dealAyoId', 'comment', ''];

function WorkSheet() {
    const [dateFrom, setDateFrom] = useState(new Date().setHours(0, 0, 0, 0));
    const [backdropOpen, setBackdropOpen] = useState(false);
    const [activeBtn, setActiveBtn] = useState('today');
    const [dateTo, setDateTo] = useState(new Date().setHours(24));
    const [toEmp, setToEmp] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(20);
    const params = { dateFrom: new Date(dateFrom), dateTo: new Date(dateTo), dealAyoId: toEmp, page, rowsPerPage };
    const {
        data,
        error,
        mutate
    } = useSWR(`${baseURL}/api/worksheet`, url => fetchData(url, params));
    const {
        data: employees,
        error1,
    } = useSWR(`${baseURL}/api/employees`, fetchData);

    const handleEmpChange = async (e) => {
        setBackdropOpen(true);
        setToEmp(e.target.value);
        await handleMutateData(`${baseURL}/api/worksheet`, params,);
        setBackdropOpen(false)
        mutate()
    }
    const handleChangePage = async (event, newPage) => {
        setBackdropOpen(true);
        setPage(parseInt(newPage));
        await handleMutateData(`${baseURL}/api/worksheet`, params);
        mutate();
        setBackdropOpen(false);
    }
    const handleChangeRowsPerPage = async (event) => {
        setBackdropOpen(true);
        setRowsPerPage(parseInt(event.target.value, 10))
        setPage(parseInt(0))
        await handleMutateData(`${baseURL}/api/worksheet`, params);
        mutate();
        setBackdropOpen(false);
    }
    const handleDateClick = async (d, df, dt) => {
        setBackdropOpen(true)
        const { dateFrom, dateTo, activeBtn } = handleDateChangeClick(d, df, dt)
        setDateFrom(dateFrom);
        setDateTo(dateTo);
        await handleMutateData(`${baseURL}/api/worksheet`, params);
        mutate()
        setBackdropOpen(false);
        setActiveBtn(activeBtn)
    }

    if (error || error1) {
        return <div>Error occured while fetching worksheet details</div>
    } else if (!data || !employees) {
        return <div>Please wait fetching workSheet details</div>
    }
    
    function sortAscFunc(a, b) {
        return new Date(b.date) - new Date(a.date);
    }
    console.log((new Date()).getTimezoneOffset())
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
                    <Typography variant='h6'>loding...</Typography>
                </Stack>
            </Backdrop>
            <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                <FilterByDate
                    activeBtn={activeBtn}
                    onClick={handleDateClick}
                />
                {parseJwt(Cookies.get('token')).role == 'super-admin' &&
                    <FilterByEmp
                        onChange={handleEmpChange}
                        toEmp={toEmp}
                        employees={employees.data}
                        width="150px"
                    />
                }
                <CommentModal
                    collName="attendance"
                    mutate={mutate}
                />
            </Stack>
            <AttendanceTable
                tableHeading={tableHeading}
                dataHeading={dataHeading}
                data={data.data.sort(sortAscFunc)}
                page={page}
                rowsPerPage={rowsPerPage}
                totalCount={data.data.length}
                handleChangePage={handleChangePage}
                handleChangeRowsPerPage={handleChangeRowsPerPage}
                ExtraCells={{ edit: EditComment }}
            />
        </div>
    )
}

export default WorkSheet