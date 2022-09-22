import { Backdrop, Button, Checkbox, CircularProgress, FormControlLabel, Stack, TextareaAutosize, Typography, } from '@mui/material';
import axios from 'axios';
import React, { useState } from 'react'
import useSWR from 'swr';
import { baseURL } from '../../helpers/constants';
import TasksTable from '../../components/Table/TasksTable';
import CommentModal from '../../components/CommentModal/CommentModal';
import { withAuth } from '../../HOC/withAuth';
import fetchData from '../../controllers/fetchData';
import { Box } from '@mui/system';
import { useRouter } from 'next/router';
import Head from 'next/head';
import moment from 'moment';
import handleMutateData from '../../controllers/handleMutateData';

const tableHeading = ['model', 'Title', 'brand', 'supplier', 'Category', 'MRP', 'SP', 'assignTo', 'Entry', 'error', 'Time', 'additional', 'remarks',];
const dataHeading = ['model', 'title', 'brand', 'supplier', 'category', 'MRP', 'SP', 'assignToName', 'entryStatus', 'errorTask', 'entryDate',]

function Tasks() {
    const router = useRouter();
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(20);
    const [comment, setComment] = useState('');
    const [disableClick, setDisableClick] = useState(false);
    const [backdropOpen, setBackdropOpen] = useState(false);
    const params = { page, rowsPerPage };
    const { tid } = router.query;

    const {
        data: tasks,
        error: error1,
        mutate: mutateTasks
    } = useSWR(`${baseURL}/api/tasks/${tid}`,
        url => fetchData(url, params)
    );

    const handleChangePage = async (event, newPage) => {
        setBackdropOpen(true);
        setPage(parseInt(newPage))
        await handleMutateData(`${baseURL}/api/tasks/${tid}`, params);
        mutateTasks();
        setBackdropOpen(false)
    }
    const handleChangeRowsPerPage = async (event) => {
        setBackdropOpen(true);
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
        await handleMutateData(`${baseURL}/api/tasks/${tid}`, params);
        mutateTasks();
        setBackdropOpen(false);
    }

    const handleStatusChange = async (event, _id, updateField) => {
        //only allow to tick check box if work in not ended
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
        await axios.put(`${baseURL}/api/products/${_id}`, { ...update, taskId: tid })
            .then(() => {
                mutateTasks()
                setDisableClick(false);
            }).catch((err) => {
                console.log(err)
            })
    }

    if (error1) {
        return <div>Failed to load Tasks</div>
    } else if (!tasks) {

        return <div>Please wait getting Tasks...</div>
    } else if (tasks.data.length == 0) {
        return (
            <Box textAlign="center">
                <Typography variant="h5">No Tasks Found</Typography>
                <Button variant='outlined' sx={{ my: 1 }} disabled >Get Random Task</Button>
            </Box>
        )
    }

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
                            // onChange={handleEndWork}
                            />
                        }
                        label="End Work"
                    />
                </Stack>
                <Stack>
                    <CommentModal />
                </Stack>
            </Stack>
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
                oldAssignedDate={tasks.oldAssignedDate}
            // sku={sku}
            // handleSkuChange={handleSkuChange}
            />
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