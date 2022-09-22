import { Backdrop, CircularProgress, Stack, Typography } from '@mui/material'
import Cookies from 'js-cookie'
import React, { useState } from 'react'
import useSWR from 'swr'
import CommentModal from '../../components/CommentModal/CommentModal'
import FilterByDate from '../../components/FilterByDate'
import FilterByEmp from '../../components/FilterByEmp'
import AttendanceTable from '../../components/Table/AttendanceTable'
import fetchData from '../../controllers/fetchData'
import handleDateChangeClick from '../../controllers/handelDateChangeClick'
import handleMutateData from '../../controllers/handleMutateData'
import parseJwt from '../../controllers/parseJwt'
import { baseURL } from '../../helpers/constants'

const tableHeading = ['date', 'day', '', 'name', 'Id', 'comment', 'Edit'];
const dataHeading = ['date', 'name', 'dealAyoId', 'comment'];

function WorkSheet() {
    const [dateFrom, setDateFrom] = useState(new Date().setHours(0, 0, 0, 0));
    const [backdropOpen, setBackdropOpen] = useState(false);
    const [activeBtn, setActiveBtn] = useState('today');
    const [dateTo, setDateTo] = useState(new Date().setHours(24));
    const [toEmp, setToEmp] = useState('');
    const params = { dateFrom: new Date(dateFrom), dateTo: new Date(dateTo), dealAyoId: toEmp };
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
    return (
        <div>
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
                data={data.data}
            />
        </div>
    )
}

export default WorkSheet