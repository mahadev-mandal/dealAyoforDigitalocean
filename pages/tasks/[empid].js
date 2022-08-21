import { Button, Checkbox, FormControlLabel, Stack, } from '@mui/material';
import axios from 'axios';
import Cookies from 'js-cookie';
import React, { useState } from 'react'
import useSWR from 'swr';
import Table from '../../components/Table/Table'
import { baseURL } from '../../helpers/constants';
import parsejwt from '../../controllers/parseJwt';
import { useEffect } from 'react';

const tableHeading = ['model', 'Title', 'Vendor', 'Category', 'MRP', 'SP', 'Entry Status', 'Entry Date'];
const dataHeading = ['model', 'title', 'vendor', 'category', 'MRP', 'SP', 'entryStatus', 'entryDate']

function Tasks() {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(20);
    const [endWork, setEndWork] = useState(false);

    const checkEndWork = async () => {
        await axios.post(`${baseURL}/api/attendance`, {
            date: new Date(),
            dealAyoId: parsejwt(Cookies.get('token')).dealAyoId,
        }).then(async (res) => {
            if (res.data) {
                setEndWork(true)
            } else {
                setEndWork(false)
            }
        })
    }

    useEffect(() => {
        checkEndWork();
    })

    const fetchData = async (url) => {
        return await axios.get(url)
            .then((res) => {
                if (res.data.length > 1) {
                    return res.data
                } else {
                    return []
                }
            }).catch((err) => {
                throw new Error(err)
            })
    }

    const handleChangePage = (event, newPage) => {
        setPage(parseInt(newPage))
    }
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0)
    }

    const { data: products, error, mutate } = useSWR(`${baseURL}/api/tasks/${parsejwt(Cookies.get('token')).dealAyoId}`, fetchData);

    const assignTasks = async () => {
        if (products.length < 1) {
            await axios.put(`${baseURL}/api/mark-attendance/`, {
                date: new Date(),
                dealAyoId: parsejwt(Cookies.get('token')).dealAyoId,
                name: parsejwt(Cookies.get('token')).name,
                entryTime: new Date(),
            }).then(async () => {
                await axios.post(`${baseURL}/api/tasks/${parsejwt(Cookies.get('token')).dealAyoId}`)
                    .then(() => mutate())
            }).catch((err) => { throw new Error(err) })
        }
    }
    const handleEndWork = async () => {
        if (!endWork) {
            await axios.put(`${baseURL}/api/mark-attendance`, {
                date: new Date(),
                dealAyoId: parsejwt(Cookies.get('token')).dealAyoId,
                exitTime: new Date(),
                comment: ''
            }).then(() => {
                setEndWork(true)
            })
        }
    }

    const handleStatusChange = async (event, _id) => {
        //only allow to tick check box if work in not ended
        if (!endWork) { 
            let date = null;
            if (event.target.checked) {
                date = new Date();
            } else {
                date = ''
            }
            await axios.put(`${baseURL}/api/products/${_id}`, {
                entryStatus: event.target.checked,
                date: date,
            }).then(() => {
                mutate()
            }).catch((err) => {
                console.log(err)
            })
        }else{
            alert("After Work Ended You are not allow to edit. Please contact admin")
        }
    }

    if (error) {
        return <div>Failed to load products</div>
    } else if (!products) {
        return <div>Please wait loading...</div>
    }

    return (
        <div>
            <Stack justifyContent="space-between" sx={{ mb: 0.5 }} direction="row">
                <Stack spacing={2} direction="row">
                    <Button variant="outlined">Get Extra 5 Tasks</Button>
                </Stack>
                <Stack spacing={2} alignItems="center" justifyContent="center" direction="row">
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={products.length > 1}
                                onChange={assignTasks}
                            />
                        }
                        label="Start"
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={endWork}
                                onChange={handleEndWork}
                            />
                        }
                        label="End"
                    />
                </Stack>
            </Stack>
            <Table
                tableHeading={tableHeading}
                dataHeading={dataHeading}
                data={products}
                onStatusChange={handleStatusChange}
                page={page}
                totalCount={products.length}
                rowsPerPage={rowsPerPage}
                handleChangePage={handleChangePage}
                handleChangeRowsPerPage={handleChangeRowsPerPage}
            />
        </div>
    )
}

export default (Tasks)