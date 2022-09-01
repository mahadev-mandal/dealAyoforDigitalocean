import { Button, Checkbox, CircularProgress, FormControlLabel, Stack, TextareaAutosize, } from '@mui/material';
import axios from 'axios';
import Cookies from 'js-cookie';
import React, { useState } from 'react'
import useSWR from 'swr';
import { baseURL } from '../../helpers/constants';
import parsejwt from '../../controllers/parseJwt';
import { useEffect } from 'react';
import TasksTable from '../../components/Table/TasksTable';
import CommentModal from '../../components/CommentModal/CommentModal';
import { withAuth } from '../../HOC/withAuth';
import countTotalData from '../../controllers/countTotalData';
import handleRowsPageChange from '../../controllers/handleRowsPageChange';

const tableHeading = ['model', 'Title', 'Vendor', 'Category', 'MRP', 'SP', 'Entry Status', 'error', 'Entry Time', 'additional', 'remarks',];
const dataHeading = ['model', 'title', 'vendor', 'category', 'MRP', 'SP', 'entryStatus', 'errorTask', 'entryDate',]

function Tasks() {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(20);
    const [endWork, setEndWork] = useState(false);
    const [comment, setComment] = useState('');
    const [assigning, setAssigning] = useState(false);
    const [disableClick, setDisableClick] = useState(true);

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
        return await axios.get(url, { params: { page, rowsPerPage } })
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


    const { data: products, error1, mutate } = useSWR(`${baseURL}/api/tasks/${parsejwt(Cookies.get('token')).dealAyoId}`, fetchData);
    const { data: totalCount, error2 } = useSWR(`${baseURL}/api/count-data`,
        url => countTotalData(url, 'empTasks')
    );

    const handleChangePage = (event, newPage) => {
        setPage(parseInt(newPage))
        handleRowsPageChange(`${baseURL}/api/tasks/${parsejwt(Cookies.get('token')).dealAyoId}`, { page, rowsPerPage }, mutate)
    }
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0)
        handleRowsPageChange(`${baseURL}/api/tasks/${parsejwt(Cookies.get('token')).dealAyoId}`, { page, rowsPerPage }, mutate)
    }

    const assignTasks = async () => {
        if (products.length < 1) {
            setAssigning(true);
            if (products.length < 1) {
                await axios.put(`${baseURL}/api/mark-attendance/`, {
                    date: new Date(),
                    dealAyoId: parsejwt(Cookies.get('token')).dealAyoId,
                    name: parsejwt(Cookies.get('token')).name,
                    entryTime: new Date(),
                }).then(async () => {
                    await axios.post(`${baseURL}/api/tasks/${parsejwt(Cookies.get('token')).dealAyoId}`)
                        .then(() => {
                            setAssigning(false);
                            mutate();
                        })
                }).catch((err) => { throw new Error(err); })
            }
        }
    }
    const handleEndWork = async () => {
        if (!endWork) {
            await axios.put(`${baseURL}/api/mark-attendance`, {
                date: new Date(),
                dealAyoId: parsejwt(Cookies.get('token')).dealAyoId,
                exitTime: new Date(),
                comment: comment
            }).then(() => {
                setEndWork(true)
            })
        }
    }

    const handleStatusChange = async (event, _id, updateField) => {
        //only allow to tick check box if work in not ended
        if (!endWork) {
            setDisableClick(true);
            let date = null;
            if (event.target.checked) {
                date = new Date();
            } else {
                date = ''
            }
            let update;

            if (updateField === 'entryStatus') {
                update = {
                    entryStatus: event.target.checked,
                    date: date,
                }
            } else {
                update = {
                    errorTask: event.target.checked,
                }
            }
            await axios.put(`${baseURL}/api/products/${_id}`, update)
                .then(() => {
                    mutate()
                    setDisableClick(false);
                }).catch((err) => {
                    console.log(err)
                })
        } else {
            alert("After Work Ended You are not allow to edit. Please contact admin")
        }
    }
    console.log(totalCount)
    if (error1 || error2) {
        return <div>Failed to load Tasks</div>
    } else if (!products || totalCount === undefined) {
        return <div>Please wait getting Tasks...</div>
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
                        label="Start Work"
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={endWork}
                                onChange={handleEndWork}
                            />
                        }
                        label="End Work"
                    />
                </Stack>
                <Stack>
                    <CommentModal
                        onChange={e => setComment(e.target.value)}
                        value={comment}
                        endWork={endWork}
                    />
                </Stack>
            </Stack>
            {(assigning) ?
                <Stack alignItems="center" justifyContent="center" sx={{ mt: 3 }}>
                    <CircularProgress color="secondary" />
                    Assigning Tasks...
                </Stack> :
                <TasksTable
                    tableHeading={tableHeading}
                    dataHeading={dataHeading}
                    data={products}
                    onStatusChange={handleStatusChange}
                    page={page}
                    totalCount={totalCount}
                    rowsPerPage={rowsPerPage}
                    handleChangePage={handleChangePage}
                    handleChangeRowsPerPage={handleChangeRowsPerPage}
                    disableClick={disableClick}
                // sku={sku}
                // handleSkuChange={handleSkuChange}
                />
            }
            <TextareaAutosize
                minRows={3}
                placeholder="your comment"
                style={{ width: '100%', margin: '20px 0', }}
                value={comment}
                onChange={e => setComment(e.target.value)}
                onClick={() => alert('After work ended not allowed to comment')}
                disabled
            />
        </div>
    )
}

export default withAuth(Tasks)