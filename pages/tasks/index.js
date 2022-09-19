

// import axios from "axios";
import React, { useState } from "react";
import useSWR from "swr";
import { baseURL, containerMargin } from "../../helpers/constants";
import { withAuth } from "../../HOC/withAuth";
import TasksCard from "../../components/Cards/TasksCard";
import { Box, CircularProgress, Stack, Typography, Backdrop, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import fetchData from "../../controllers/fetchData";
import FilterByDate from "../../components/FilterByDate";
import handleDateChange from "../../controllers/handleDateChange";
import AssignTasks from "../../components/FullScreenModal/AssignTasks";
import axios from "axios";
import Cookies from "js-cookie";
import parseJwt from "../../controllers/parseJwt";
import Head from "next/head";
import LinearProgressBar from "../../components/ProgressBar/LinearProgress";

function Tasks() {
    const [activeBtn, setActiveBtn] = useState('today');
    const [dateFrom, setDateFrom] = useState(new Date().setHours(0, 0, 0, 0));
    const [dateTo, setDateTo] = useState(new Date().setHours(24));
    const [backdropOpen, setBackdropOpen] = useState(false);
    const [assignToEmp, setAssignToEmp] = useState('');

    const params = { dateFrom: new Date(dateFrom), dateTo: new Date(dateTo), assignToEmp };
    // const pendingParams = { dateFrom: new Date(dateFrom), dateTo: new Date(dateTo), assignToEmp }

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

    const handleDateClick = async (d) => {
        if (d == 'thisWeek') {
            setBackdropOpen(true);
            const date = new Date();
            const lastSun = new Date(date.setDate(date.getDate() - date.getDay())).setHours(0, 0, 0, 0);
            const commingSat = new Date(date.setDate(new Date(lastSun).getDate() + 6)).setHours(24)
            setDateFrom(lastSun);
            setDateTo(commingSat)
            await handleDateChange(params, mutate, mutateUpdateTasks)
            setActiveBtn('thisWeek')
            setBackdropOpen(false)
        } else if (d == 'prevWeek') {
            setBackdropOpen(true);
            const date = new Date();
            const prevWeekSun = new Date(date.setDate(date.getDate() - date.getDay() - 7)).setHours(0, 0, 0, 0);
            const prevWeekCommingSat = new Date(date.setDate(new Date(prevWeekSun).getDate() + 6)).setHours(24)
            setDateFrom(prevWeekSun);
            setDateTo(prevWeekCommingSat)
            await handleDateChange(params, mutate, mutateUpdateTasks)
            setActiveBtn('prevWeek')
            setBackdropOpen(false)
        } else if (d == 'thisMonth') {
            setBackdropOpen(true);
            const thisYear = new Date().getFullYear();
            const thisMonth = new Date().getMonth(); //month starts from 0-11
            setDateFrom(new Date(thisYear, thisMonth, 1));
            setDateTo(new Date(thisYear, thisMonth + 1, 0));
            await handleDateChange(params, mutate, mutateUpdateTasks);
            setActiveBtn('thisMonth');
            setBackdropOpen(false);
        } else {
            setBackdropOpen(true);
            setDateFrom(new Date().setHours(0, 0, 0, 0));
            setDateTo(new Date().setHours(24));
            await handleDateChange(params, mutate, mutateUpdateTasks);
            setActiveBtn('today')
            setBackdropOpen(false);
        }
    }
    const handleFilterChange = async (event) => {
        setAssignToEmp(event.target.value)
        setBackdropOpen(true);
        await axios.get(`${baseURL}/api/tasks`, params)
            .then(() => { mutate(); mutateUpdateTasks(); setBackdropOpen(false) })
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
                />
                <Stack direction="row" alignItems="center">
                    <Typography variant='h6'>SortBy</Typography>
                    <FormControl size="small" fullWidth>
                        <InputLabel id="demo-simple-select-label">Assign To</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={assignToEmp}
                            sx={{ width: 150, }}
                            label="Assign To"
                            onChange={handleFilterChange}
                        >
                            <MenuItem value=''>None</MenuItem>
                            {employees.data.map((emp) => (
                                <MenuItem value={emp.dealAyoId} key={emp.dealAyoId}>{emp.firstName}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
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

