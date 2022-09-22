import React, { useState } from "react";
import useSWR from "swr";
import { baseURL, containerMargin } from "../../helpers/constants";
import { withAuth } from "../../HOC/withAuth";
import TasksCard from "../../components/Cards/TasksCard";
import { Box, CircularProgress, Stack, Typography, Backdrop, } from "@mui/material";
import fetchData from "../../controllers/fetchData";
import FilterByDate from "../../components/FilterByDate";
import AssignTasks from "../../components/FullScreenModal/AssignTasks";
import Cookies from "js-cookie";
import parseJwt from "../../controllers/parseJwt";
import Head from "next/head";
import LinearProgressBar from "../../components/ProgressBar/LinearProgress";
import handleDateChangeClick from "../../controllers/handelDateChangeClick";
import handleMutateData from "../../controllers/handleMutateData";
import FilterByEmp from "../../components/FilterByEmp";

function Tasks() {
    const [activeBtn, setActiveBtn] = useState('today');
    const [dateFrom, setDateFrom] = useState(new Date().setHours(0, 0, 0, 0));
    const [dateTo, setDateTo] = useState(new Date().setHours(24));
    const [backdropOpen, setBackdropOpen] = useState(false);
    const [toEmp, setToEmp] = useState('');

    const params = { dateFrom: new Date(dateFrom), dateTo: new Date(dateTo), dealAyoId:toEmp };
    // const pendingParams = { dateFrom: new Date(dateFrom), dateTo: new Date(dateTo), toEmp }

    const {
        data,
        error,
        mutate
    } = useSWR(`${baseURL}/api/tasks`, url => fetchData(url, params));
    // const {
    //     data: pending,
    //     error1,
    // } = useSWR(`${baseURL}/api/tasks`, url => fetchData(url, params));
    const {
        data: updateTasks,
        error: error2,
        mutate: mutateUpdateTasks
    } = useSWR(`${baseURL}/api/update-tasks`, url => fetchData(url, params))
    const {
        data: employees,
        error1
    } = useSWR(`${baseURL}/api/employees`, fetchData)

    const handleDateClick = async (d, df, dt) => {
        setBackdropOpen(true)
        const { dateFrom, dateTo, activeBtn } = handleDateChangeClick(d, df, dt)
        setDateFrom(dateFrom);
        setDateTo(dateTo);
        await handleMutateData(`${baseURL}/api/attendance`, params)
        mutate();
        mutateUpdateTasks()
        setBackdropOpen(false);
        setActiveBtn(activeBtn)
    }
    const handleEmpChange = async (e) => {
        setBackdropOpen(true);
        setToEmp(e.target.value);
        await handleMutateData(`${baseURL}/api/attendance`, params,);
        mutate();
        mutateUpdateTasks();
        setBackdropOpen(false);
    }

    function sortDescFunc(a, b) {
        if (a.taskId < b.taskId) {
            return 0;
        }
        return -1;
    }
    function sortAscFunc(a, b) {
        return new Date(a.date) - new Date(b.date);
    }
    const checkTaskCompleted = (tasks) => {
        const completed = tasks.tasks.filter(t => t.entryStatus).length;
        const errors = tasks.tasks.filter(t => t.errorTask).length;
        return (tasks.tasks.length <= (completed + errors))
    }

    if (error || error1 || error2) {
        return <div>Failed to load products</div>;
    } else if (!data || !employees || !updateTasks) {
        return <div>Please wait loading...</div>;
    }

    return (
        <Box sx={{ m: containerMargin }}>
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
            <Stack direction="row" justifyContent="space-between">
                <Stack>
                    {parseJwt(Cookies.get('token')).role == 'super-admin' && <AssignTasks />}
                </Stack>
                <Stack>
                    <LinearProgressBar data={data.data} />
                </Stack>
                <Stack></Stack>
            </Stack>
            <Stack direction="row" justifyContent="space-between">
                <FilterByDate
                    activeBtn={activeBtn}
                    onClick={handleDateClick}
                    customOpen={backdropOpen}
                />
                <Stack direction="row" alignItems="center">
                    <Typography variant='h6'>SortBy</Typography>
                    <FilterByEmp
                        onChange={handleEmpChange}
                        toEmp={toEmp}
                        employees={employees.data}
                    />
                </Stack>
            </Stack>
            <Stack spacing={2}>
                <Stack
                    direction="row"
                    sx={{
                        mt: 1,
                        width: '100%',
                        overflowX: 'auto',
                        py: 1
                    }}
                    spacing={1.5}
                >
                    {data.data.sort(sortDescFunc).map((tasks) => (
                        <TasksCard
                            workType="Data Entry"
                            key={tasks.taskId}
                            tasks={tasks}
                        />
                    ))}
                    {updateTasks.data.sort(sortDescFunc).map((tasks) => (
                        <TasksCard
                            workType="Product Update"
                            key={tasks.taskId}
                            tasks={tasks}
                        />
                    ))}
                </Stack>
                <Box>
                    <Typography variant='h6'>Pending... Tasks</Typography>
                    <Stack
                        direction="row"
                        spacing={1.5}
                        sx={{
                            width: '100%',
                            overflowX: 'auto',
                            py: 1
                        }}
                    >
                        {data.data.sort(sortAscFunc).map((tasks) => (
                            !checkTaskCompleted(tasks) &&
                            <TasksCard
                                workType="Data Entry"
                                key={tasks.taskId}
                                tasks={tasks}
                            />
                        ))}
                        {updateTasks.data.sort(sortDescFunc).map((tasks) => (
                            <TasksCard
                                workType="Product Update"
                                key={tasks.taskId}
                                tasks={tasks}
                            />
                        ))}
                    </Stack>
                </Box>
            </Stack>
        </Box>

    );
}

export default withAuth(Tasks);

