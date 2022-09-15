import * as React from "react";
import Dialog from "@mui/material/Dialog";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Slide from "@mui/material/Slide";
import { FormControl, InputLabel, MenuItem, Select, Stack, TextField } from "@mui/material";
import { useState } from "react";
import useSWR, { mutate } from "swr";
import { baseURL } from "../../helpers/constants";
import fetchData from "../../controllers/fetchData";
import AssignTasksTable from "../Table/AssignTaskTable";
import EditIcon from '@mui/icons-material/Edit';


const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const tableHeading = [
    "model",
    "title",
    "supplier",
    "category",
    "MRP",
    "SP",
    "Assign to",
    "entry status",
    "assign date",
    "remarks"
];
const dataHeading = [
    "model",
    "title",
    "supplier",
    "category",
    "MRP",
    "SP",
    "assignToName",
    "entryStatus",
];

export default function EditTasksDialog() {
    const [open, setOpen] = React.useState(false);
    const date = new Date();
    const year = date.getFullYear();
    let month = date.getMonth() + 1;
    month = String("0" + month).slice(-2);
    const day = String("0" + date.getDate()).slice(-2);
    const [assignDate, setAssignDate] = useState(`${year}-${month}-${day}`)
    const [assignToEmp, setAssignToEmp] = useState({});
    const [tasksId, setTasksId] = useState(1)

    const { data: employees, error } = useSWR(`${baseURL}/api/employees`, fetchData)
    const handleTasksEditClick = (event) => {
        event.stopPropagation()
        setOpen(true);
    };
    const handleClose = () => {
        mutate(`${baseURL}/api/tasks`)
        setOpen(false);
    };

    if (error) {
        return <div>Error occured</div>
    } else if (!employees) {
        return <div>Please wait loading...</div>
    }

    return (
        <div>
            <IconButton size="small" sx={{ position: 'absolute', right: 0, top: 0 }} onClick={handleTasksEditClick}>
                <EditIcon />
            </IconButton>
            <Dialog
                fullScreen
                open={open}
                onClose={handleClose}
                TransitionComponent={Transition}
            >
                <AppBar sx={{ position: "relative" }}>
                    <Toolbar>
                        <Stack
                            direction="row"
                            sx={{ width: "100%" }}
                            justifyContent="space-between"
                            alignItems="center"
                        >
                            <IconButton
                                edge="start"
                                color="inherit"
                                onClick={handleClose}
                                aria-label="close"
                            >
                                <CloseIcon />
                            </IconButton>
                            <Stack direction="row" spacing={5}>
                                <TextField
                                    type="date"
                                    variant="standard"
                                    sx={{ input: { color: "white" }, width: 250 }}
                                    value={assignDate}
                                    onChange={e => setAssignDate(e.target.value)}
                                />
                                <TextField
                                    type="number"
                                    variant="standard"
                                    sx={{ input: { color: "white" }, width: 100 }}
                                    value={tasksId}
                                    onChange={e => setTasksId(e.target.value)}
                                />
                                <FormControl size="small" fullWidth>
                                    <InputLabel id="demo-simple-select-label">Assign To</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        defaultValue=""
                                        sx={{ width: 150, color: 'white' }}
                                        label="Assign To"
                                        onChange={e => setAssignToEmp(e.target.value)}
                                    >
                                        <MenuItem value={{}}>None</MenuItem>
                                        {employees.data.map((emp) => (
                                            <MenuItem value={emp} key={emp.dealAyoId}>{emp.firstName}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Stack>
                            <Stack spacing={1} direction="row">
                                {/* <Button color="inherit">Verify</Button>
                <Button
                  color="inherit"
                  onClick={handleAssign}
                // disabled={data.length < 1}
                >
                  save
                </Button> */}
                            </Stack>
                        </Stack>
                    </Toolbar>
                </AppBar>
                <AssignTasksTable
                    collectionName="products"
                    tableHeading={tableHeading}
                    dataHeading={dataHeading}
                    assignDate={assignDate}
                    assignToEmp={assignToEmp}
                    tasksId={tasksId}
                    employees={employees.data}
                    defaultEmpFilter=""
                    defaultAssignFilter="unassigned"
                />
            </Dialog>
        </div>
    );
}
