

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

function Tasks() {
    const [activeBtn, setActiveBtn] = useState('today');
    const [dateFrom, setDateFrom] = useState(new Date().setHours(0, 0, 0, 0));
    const [dateTo, setDateTo] = useState(new Date().setHours(24));
    const [backdropOpen, setBackdropOpen] = useState(false);
    const [assignToEmp, setAssignToEmp] = useState('');
    const params = { dateFrom: new Date(dateFrom), dateTo: new Date(dateTo), assignToEmp };

    const {
        data,
        error,
        mutate
    } = useSWR(`${baseURL}/api/tasks/`, url => fetchData(url, params));
    const {
        data: employees,
        error1
    } = useSWR(`${baseURL}/api/employees`, fetchData)

    const handleDateClick = async (d) => {
        if (d == 'thisWeek') {
            setBackdropOpen(true);
            const date = new Date();
            const lastSun = new Date(date.setDate(date.getDate() - date.getDay())).setHours(0, 0, 0, 0);
            setDateFrom(lastSun);
            setDateTo(new Date().setHours(24))
            await handleDateChange(params, mutate)
            setActiveBtn('thisWeek')
            setBackdropOpen(false)
        } else if (d == 'thisMonth') {
            setBackdropOpen(true);
            const thisYear = new Date().getFullYear();
            const thisMonth = new Date().getMonth(); //month starts from 0-11
            setDateFrom(new Date(thisYear, thisMonth, 1).toLocaleString());
            setDateTo(new Date().setHours(24));
            await handleDateChange(params, mutate);
            setActiveBtn('thisMonth');
            setBackdropOpen(false);
        } else {
            setBackdropOpen(true);
            setDateFrom(new Date().setHours(0, 0, 0, 0));
            setDateTo(new Date().setHours(24));
            await handleDateChange(params, mutate);
            setActiveBtn('today')
            setBackdropOpen(false);
        }
    }
    const handleFilterChange = async (event) => {
        setAssignToEmp(event.target.value)
        console.log(params)
        setBackdropOpen(true);
        await axios.get(`${baseURL}/api/tasks`, params)
            .then((r) => { mutate(); setBackdropOpen(false); console.log(r) })
    }

    if (error || error1) {
        return <div>Failed to load products</div>;
    } else if (!data || !employees) {
        return <div>Please wait loading...</div>;
    }

    let arr = [];
    data.data.filter((data, i, self) => {
        // self.findIndex(d => new Date(d.assignDate).toDateString() === new Date(data.assignDate).toDateString()) === i
        const indx = self.findIndex(
            (d) =>
                new Date(d.assignDate).toDateString() ===
                new Date(data.assignDate).toDateString() &&
                d.tasksId === data.tasksId
        );
        // console.log(indx ===i )
        if (indx === i) {
            arr.push([data]);
        } else {
            arr[i] = "";
            arr[indx].push(data);
        }
    });
    arr = arr.filter((item) => item.length);

    return (
        <Box sx={{ m: containerMargin }}>
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
                    <AssignTasks />
                    <FilterByDate
                        activeBtn={activeBtn}
                        onClick={handleDateClick}
                    />
                </Stack>
                <Stack direction="row" alignItems="center">
                    <Typography variant='h6'>SortBy</Typography>
                    <FormControl size="small" fullWidth>
                        <InputLabel id="demo-simple-select-label">Assign To</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={assignToEmp}
                            sx={{ width: 150, color: 'white' }}
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
            <Stack direction="row" sx={{ mt: 1 }} spacing={1.5}>
                {arr.map((ar) => (
                    <TasksCard
                        key={ar[0].model}
                        tasks={ar}
                    />
                ))}
            </Stack>
        </Box>
    );
}

export default withAuth(Tasks);

