import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import AddIcon from '@mui/icons-material/Add';
import { CircularProgress, Stack, Typography } from '@mui/material';
import * as XLSX from 'xlsx';
import axios from 'axios';
import { baseURL } from '../../helpers/constants';
import SimpleTable from '../Table/SimpleTable';
import { mutate } from 'swr';

const allFieldsArr = ['title', 'model', 'supplier', 'category', 'brand', 'weight', 'MRP', 'SP', 'quantity', 'status', 'entryStatus', 'entryDate', 'entryBy', 'assignDate', 'assignTo', 'level']
const reqFieldsArr = ['title', 'model', 'supplier', 'category'];

const checkReqFields = (dataArr, reqArr) => {
    return reqArr.every(field => dataArr.includes(field))
}
//put other details except allfieldsArr to additional details
const finalDataArr = (dataArr, allFieldsArr) => {
    return dataArr.map((d) => {
        let data = {};
        let additionalDetails = {};
        for (const key in d) {
            if (allFieldsArr.includes(key)) {
                data = { ...data, [key]: d[key] }
            } else {
                additionalDetails = { ...additionalDetails, [key]: d[key] }
            }
        }
        data = { ...data, additionalDetails }
        return data;

    })
}


const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function FullScreenDialog() {
    const [open, setOpen] = React.useState(false);
    const [file, setFile] = React.useState(null);
    const [data, setData] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(20);
    const [tableHeading, setTableHeading] = React.useState([])
    const [dataHeading, setdataHeading] = React.useState([])
    const [msg, setMsg] = React.useState(null);
    const [saving, setSaving] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        mutate(`${baseURL}/api/products`)
        mutate(`${baseURL}/api/count-data`)
        setMsg(null)
        setOpen(false);
        setData([])
        setRowsPerPage(20);
        setTableHeading([])
        setdataHeading([])
    };

    const handleChangePage = (event, newPage) => {
        setPage(parseInt(newPage));
    }
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0)
    }

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
        setData([])
    }
    // const promise = new Promise((resolve, reject) => {
    //     console.log('start')
    //     const fileReader = new FileReader();
    //     fileReader.readAsArrayBuffer(file)
    //     fileReader.onload = (e) => {
    //         const bufferArray = e.target.result;
    //         const wb = XLSX.read(bufferArray, { type: 'buffer' });
    //         const wsname = wb.SheetNames[0];
    //         const ws = wb.Sheets[wsname];
    //         const data = XLSX.utils.sheet_to_json(ws);
    //         resolve(data);
    //     }
    //     fileReader.onerror = (err) => {
    //         reject(err);
    //     }
    // })
    // promise.then((d) => {
    //     console.log(d)
    //     console.log('end')
    // })

    const handleVerify = async () => {
        if (file) {
            setLoading(true);
            const data = await file.arrayBuffer();
            const workbook = XLSX.read(data)
            const worksheet = workbook.Sheets[workbook.SheetNames[0]]
            const jsonData = XLSX.utils.sheet_to_json(worksheet)
            const dataKeysArr = Object.keys(jsonData[0])
            //checks if all required fields are presents or not
            if (checkReqFields(dataKeysArr, reqFieldsArr)) {
                const finalData = finalDataArr(jsonData, allFieldsArr);
                setTableHeading(Object.keys(finalData[0]));
                setdataHeading(Object.keys(finalData[0]));
                setData((finalData));
                setLoading(false);
            } else {
                alert('title, model, vendor, & category are required fields')
                setLoading(false)
                setSaving(false)
            }

        } else {
            alert('Please select file to verify')
        }
    }
    const handleSave = async () => {
        setSaving(true)
        setData([])
        await axios.post(`${baseURL}/api/products`, data)
            .then((res) => {
                setSaving(false)
                setMsg(res.data)
                // setOpen(false);
            }).catch((err) => {
                console.log(err)
                setSaving(false);
            })
    }
    // const obj = {
    //     a: 'mahadev',
    //     b: 65,
    //     c: [],
    //     d: {},
    // }
    // const keys = ['string', 'number', 'array', 'object']
    // const abc = ['a', 'b', 'c', 'e']
    // const a = abc.map((i,index)=>{
    //     return i === Object.keys(obj)[index]
    // })
    // console.log(a)

    return (
        <div>
            <Button variant="contained" color="success" onClick={handleClickOpen}>
                <AddIcon /> Add
            </Button>
            <Dialog
                fullScreen
                open={open}
                onClose={handleClose}
                TransitionComponent={Transition}
            >
                <AppBar sx={{ position: 'relative' }}>
                    <Toolbar>
                        <Stack
                            direction="row"
                            sx={{ width: '100%' }}
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
                            <input
                                type="file"
                                id="fileSelect"
                                accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                                onChange={e => handleFileChange(e)}
                            />
                            <Stack spacing={1} direction="row">
                                <Button color="inherit" onClick={handleVerify}>
                                    Verify
                                </Button>
                                <Button
                                    color="inherit"
                                    onClick={handleSave}
                                    disabled={data.length < 1}
                                >
                                    save
                                </Button>
                            </Stack>
                        </Stack>
                    </Toolbar>
                </AppBar>
                {!loading ? data.length >= 1 ?
                    <SimpleTable
                        data={data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)}
                        tableHeading={tableHeading}
                        dataHeading={dataHeading}
                        page={page}
                        rowsPerPage={rowsPerPage}
                        totalCount={data.length}
                        handleChangePage={handleChangePage}
                        handleChangeRowsPerPage={handleChangeRowsPerPage}
                    /> : saving ?
                        <Stack alignItems="center" justifyContent="center" sx={{ mt: 3 }}>
                            <CircularProgress color="secondary" />
                            Saving...
                        </Stack> : <Typography variant="h6" textAlign="center" sx={{ mt: 3 }}>{msg}</Typography>
                    : <Typography variant="h6" textAlign="center" sx={{ mt: 3 }}>Please wait generating data...</Typography>
                }
            </Dialog>
        </div>
    );
}



