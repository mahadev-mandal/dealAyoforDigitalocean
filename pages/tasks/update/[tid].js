import { Button, Checkbox, CircularProgress, FormControlLabel, Stack, TextareaAutosize, Typography, } from '@mui/material';
import axios from 'axios';
import Cookies from 'js-cookie';
import React, { useState } from 'react'
import useSWR from 'swr';
import { baseURL } from '../../../helpers/constants';
import parsejwt from '../../../controllers/parseJwt';
import { useEffect } from 'react';
import TasksTable from '../../../components/Table/TasksTable';
import CommentModal from '../../../components/CommentModal/CommentModal';
import { withAuth } from '../../../HOC/withAuth';
import handleRowsPageChange from '../../../controllers/handleRowsPageChange';
import fetchData from '../../../controllers/fetchData';
import { Box } from '@mui/system';
import { useRouter } from 'next/router';
import Head from 'next/head';
import moment from 'moment';

const tableHeading = ['model', 'Title', 'brand', 'supplier', 'oldPrice', 'updated price', 'update status', 'error', 'time', 'additional', 'remarks',];
const dataHeading = ['model', 'title', 'brand', 'supplier', 'oldPrice', 'updatedPrice', 'updateStatus', 'errorTask', 'updateTime',]

function Tasks() {
    const router = useRouter();
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(20);
    const [endWork, setEndWork] = useState(false);
    const [comment, setComment] = useState('');
    const [assigning, setAssigning] = useState(false);
    const [disableClick, setDisableClick] = useState(false);
    const params = { page, rowsPerPage };
    const { tid } = router.query;

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

    const {
        data: tasks,
        error: error1,
        mutate: mutateTasks
    } = useSWR(`${baseURL}/api/update-tasks/${tid}`,
        url => fetchData(url, params)
    );

    const handleChangePage = (event, newPage) => {
        setPage(parseInt(newPage))
        handleRowsPageChange(`${baseURL}/api/tasks/${tid}`, { page, rowsPerPage }, mutateTasks)
    }
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0)
        handleRowsPageChange(`${baseURL}/api/tasks/${tid}`, { page, rowsPerPage }, mutateTasks)
    }

    const handleStartWork = async () => {
        if (tasks.data.length < 1) {
            setAssigning(true);
            if (tasks.data.length < 1) {
                await axios.put(`${baseURL}/api/mark-attendance/`, {
                    date: new Date(),
                    dealAyoId: parsejwt(Cookies.get('token')).dealAyoId,
                    name: parsejwt(Cookies.get('token')).name,
                    entryTime: new Date(),
                }).then(async () => {
                    await axios.post(`${baseURL}/api/tasks/${parsejwt(Cookies.get('token')).dealAyoId}`)
                        .then(() => {
                            setAssigning(false);
                            mutateTasks();
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
                    updateStatus: event.target.checked,
                    date: date,
                }
            } else {
                update = {
                    errorTask: event.target.checked,
                }
            }
            await axios.put(`${baseURL}/api/product-update/${_id}`, { ...update, taskId: tid })
                .then(() => {
                    mutateTasks()
                    setDisableClick(false);
                }).catch((err) => {
                    console.log(err)
                })
        } else {
            alert("After Work Ended You are not allow to edit. Please contact admin")
        }
    }

    if (error1) {
        return <div>Failed to load Tasks</div>
    } else if (!tasks) {

        return <div>Please wait getting Tasks...</div>
    } else if (tasks.data.length == 0) {
        return (
            <Box textAlign="center">
                <Typography variant="h5">No Tasks Found</Typography>
                <Button variant='outlined' sx={{ my: 1 }} disabled onClick={handleStartWork}>Get Random Task</Button>
            </Box>
        )
    }

    return (
        <div>
            <Head>
                <title>Tasks By DealAyo</title>
            </Head>
            <Stack justifyContent="space-between" sx={{ mb: 0.5 }} direction="row">
                <Stack spacing={2} direction="row">
                    <Button variant="outlined">Get Extra 5 Tasks</Button>
                </Stack>
                <Stack spacing={2} direction="row" alignItems="center">
                    <Typography variant='body1' component="span">
                        Tasks Id: <span style={{ fontWeight: 'bold' }}>{tid}</span>
                    </Typography>
                    <Typography variant='body1' component="span">
                        Assigned: <span style={{ fontWeight: 'bold' }}>
                            {moment(new Date(tasks.data[0].assignDate).setHours(10, 0, 0, 0)).fromNow()}
                        </span>
                    </Typography>
                </Stack>
                <Stack spacing={2} alignItems="center" justifyContent="center" direction="row">
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={tasks.data.length > 1}
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
                    data={tasks.data}
                    onStatusChange={handleStatusChange}
                    page={page}
                    totalCount={tasks.totalCount}
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