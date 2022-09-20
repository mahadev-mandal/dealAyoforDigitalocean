import { Backdrop, Stack } from '@mui/material'
import React, { useState } from 'react'
import useSWR from 'swr'
import CommentModal from '../../components/CommentModal/CommentModal'
import FilterByDate from '../../components/FilterByDate'
import AttendanceTable from '../../components/Table/AttendanceTable'
import fetchData from '../../controllers/fetchData'
import handleDateChange from '../../controllers/handleDateChange'
import { baseURL } from '../../helpers/constants'

const tableHeading = ['date', 'day', '', 'name', 'Id', 'comment',];
const dataHeading = ['date', 'name', 'dealAyoId', 'comment'];

function WorkSheet() {
    const [dateFrom, setDateFrom] = useState(new Date().setHours(0, 0, 0, 0));
    const [backdropOpen, setBackdropOpen] = useState(false);
    const [activeBtn, setActiveBtn] = useState('today');
    const [dateTo, setDateTo] = useState(new Date().setHours(24))
    const params = { dateFrom: new Date(dateFrom), dateTo: new Date(dateTo) };

    const {
        data,
        error,
        mutate
    } = useSWR(`${baseURL}/api/worksheet`, url => fetchData(url, params));

    const handleDateClick = async (d) => {
        if (d == 'thisWeek') {
            setBackdropOpen(true);
            const date = new Date();
            const lastSun = new Date(date.setDate(date.getDate() - date.getDay())).setHours(0, 0, 0, 0);
            const commingSat = new Date(date.setDate(new Date(lastSun).getDate() + 6)).setHours(24)
            setDateFrom(lastSun);
            setDateTo(commingSat)
            await handleDateChange(params, mutate, () => { })
            setActiveBtn('thisWeek')
            setBackdropOpen(false)
        } else if (d == 'prevWeek') {
            setBackdropOpen(true);
            const date = new Date();
            const prevWeekSun = new Date(date.setDate(date.getDate() - date.getDay() - 7)).setHours(0, 0, 0, 0);
            const prevWeekCommingSat = new Date(date.setDate(new Date(prevWeekSun).getDate() + 6)).setHours(24)
            setDateFrom(prevWeekSun);
            setDateTo(prevWeekCommingSat)
            await handleDateChange(params, mutate, () => { })
            setActiveBtn('prevWeek')
            setBackdropOpen(false)
        } else if (d == 'thisMonth') {
            setBackdropOpen(true);
            const thisYear = new Date().getFullYear();
            const thisMonth = new Date().getMonth(); //month starts from 0-11
            setDateFrom(new Date(thisYear, thisMonth, 1));
            setDateTo(new Date(thisYear, thisMonth + 1, 0));
            await handleDateChange(params, mutate, () => { });
            setActiveBtn('thisMonth');
            setBackdropOpen(false);
        } else {
            setBackdropOpen(true);
            setDateFrom(new Date().setHours(0, 0, 0, 0));
            setDateTo(new Date().setHours(24));
            await handleDateChange(params, mutate, () => { });
            setActiveBtn('today')
            setBackdropOpen(false);
        }
    }

    if (error) {
        return <div>Error occured while fetching worksheet details</div>
    } else if (!data) {
        return <div>Please wait fetching workSheet details</div>
    }
    return (
        <div>
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={backdropOpen}
            // onClick={handleClose}
            ></Backdrop>
            <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                <FilterByDate
                    activeBtn={activeBtn}
                    onClick={handleDateClick}
                />
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