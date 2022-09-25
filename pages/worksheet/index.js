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
    // const returnData = () => {

    //     let l = new Date(dateFrom);
    //     let dateArr = [];
    //     let dataArr = [];
    //     while (l < new Date(dateTo)) {
    //         dateArr.push(l.toDateString());
    //         let nd = l.setDate(l.getDate() + 1);
    //         l = new Date(nd)

    //     }
    //     dateArr.pop();

    //     let tempDateArr = dateArr;
    //     data.data.map((d, i) => {
    //         let da = ['e11', 'e12', 'd14', 'd15', 'd16', 'd17', 'd20', 'd21', 'd22', 'd23', 'd24', 'v11', 'v12', 'g11', 'c12']
    //         if (!toEmp == '') {
    //             da = [toEmp]
    //         }
    //         tempDateArr.splice(tempDateArr.indexOf(new Date(new Date(d.date)).toDateString()), 1)
    //         dataArr.push({ date: d.date, employees: [] })
    //         d.employees.map((emp) => {
    //             dataArr[i].employees.push(emp)
    //             const ind = da.indexOf(emp.dealAyoId)
    //             if (ind > -1) {
    //                 da.splice(ind, 1)
    //             }
    //         })
    //         da.forEach((id) => {
    //             dataArr[i].employees.push({ dealAyoId: id })
    //         })
    //     })
    //     tempDateArr.forEach((dt) => {
    //         dataArr.push({ date: dt, employees: [{ dealAyoId: toEmp }] })
    //     })
    //     console.log(dataArr)
    //     console.log(tempDateArr)
    //     return dataArr;
    // }

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