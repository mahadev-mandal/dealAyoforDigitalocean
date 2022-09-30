import React, { useState } from 'react';
import {
    TextField,
    Typography,
    DialogTitle,
    DialogContent,
    DialogActions,
    Dialog,
    Button,
    Backdrop,
    Stack,
    CircularProgress
} from '@mui/material';
import axios from 'axios';
import { baseURL } from '../../helpers/constants';
import FilterByEmp from '../Filter/FilterProducts/FilterByEmp';
import useSWR from 'swr';
import fetchData from '../../controllers/fetchData';
import parseJwt from '../../controllers/parseJwt';
import Cookies from 'js-cookie';

export default function UploadFileDialog() {
    let user = parseJwt(Cookies.get('token'));
    const [open, setOpen] = React.useState(false);
    const [data, setData] = useState({});
    const [backdropOpen, setBackdropOpen] = useState(false);
    const [toEmp, setToEmp] = useState(user.role == 'super-admin' ? '' : user.dealAyoId);
    const d = new Date();
    const year = d.getFullYear();
    let month = d.getMonth() + 1;
    month = String("0" + month).slice(-2);
    const day = String("0" + d.getDate()).slice(-2);
    const [date, setDate] = useState(`${year}-${month}-${day}`)
    const params = { date: new Date(date), empFilter: toEmp, statusFilter: 'entry-done', }
    
    const {
        data: employees,
        error
    } = useSWR(`${baseURL}/api/employees`, fetchData);

    const handleCountPressed = async () => {
        setBackdropOpen(true);
        await axios.get(`${baseURL}/api/products`, { params })
            .then((res) => {
                setData(res.data)
                setBackdropOpen(false);
            }).catch((err) => {
                console.log(err);
            })
    }

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setData({});
    };
    if (error) {
        return <div>Error while fetching employees</div>
    } else if (!employees) {
        return 'loading...'
    }
    return (
        <div>
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={backdropOpen}
            // onClick={handleClose}
            >
                <Stack alignItems="center" justifyContent="center" sx={{ mt: 3 }}>
                    <CircularProgress color="secondary" />
                    <Typography variant='h6'>Please wait counting...</Typography>
                </Stack>
            </Backdrop>
            <Button variant="outlined" onClick={handleClickOpen}>
                Count Tasks
            </Button>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Count Tasks"}
                </DialogTitle>
                <DialogContent sx={{ minWidth: 460 }}>
                    <Stack spacing={1}>
                        <TextField
                            fullWidth
                            type="date"
                            size="small"
                            value={date}
                            onChange={e => setDate(e.target.value)}
                        />
                        <FilterByEmp
                            toEmp={toEmp}
                            onChange={e => setToEmp(e.target.value)}
                            employees={employees.data}
                            disabled={!user.role == 'super-admin'}
                        />
                    </Stack>
                    <Typography variant="body1" sx={{ mt: 2 }}>
                        <span>Completed: </span><span style={{}}>{data.totalCount}</span>

                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCountPressed} autoFocus>
                        Count
                    </Button>
                    <Button onClick={handleClose}>Close</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
