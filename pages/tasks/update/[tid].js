import { Backdrop, Button,  CircularProgress, Stack, Typography, } from '@mui/material';
import React, { useState } from 'react'
import useSWR  from 'swr';
import { baseURL } from '../../helpers/constants';
import CommentModal from '../../components/Dialogs/Comment';
import { withAuth } from '../../HOC/withAuth';
import fetchData from '../../controllers/fetchData';
import { Box } from '@mui/system';
import { useRouter } from 'next/router';
import Head from 'next/head';
import moment from 'moment';
import handleMutateData from '../../controllers/handleMutateData';
import SimpleTable from '../../components/Table/SimpleTable';
import Remarks from '../../components/ExtraCells/Dialogs/Remarks';
import EntryOrError from '../../components/ExtraCells/EntryOrError';
import ReturnTime from '../../components/ExtraCells/ReturnTime';
import AdditionalDetails from '../../components/ExtraCells/Dialogs/AdditionalDetails';

const tableHeading = ['model', 'Title', 'brand', 'supplier', 'Category', 'MRP', 'SP', 'assignTo', 'entry', 'error', 'time', 'more', 'remarks',];
const dataHeading = ['model', 'title', 'brand', 'supplier', 'category', 'MRP', 'SP', 'assignToName', '', '', '', '', '']

function Tasks() {
    const router = useRouter();
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(20);
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
                <Stack>
                    <CommentModal />
                </Stack>
            </Stack>
            <SimpleTable
                tableHeading={tableHeading}
                dataHeading={dataHeading}
                data={tasks.data}
                totalCount={tasks.totalCount}
                page={page}
                rowsPerPage={rowsPerPage}
                handleChangePage={handleChangePage}
                handleChangeRowsPerPage={handleChangeRowsPerPage}
                ExtraCells={{
                    entry: EntryOrError,
                    error: EntryOrError,
                    time: ReturnTime,
                    more: AdditionalDetails,
                    remarks: Remarks
                }}
            />
        </div>
    )
}

export default withAuth(Tasks)


