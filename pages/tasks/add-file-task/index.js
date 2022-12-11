import { Backdrop, Button, CircularProgress, Stack, Typography } from '@mui/material'
import React, { useState } from 'react';
import useSWR from 'swr';
import { baseURL } from '../../../helpers/constants';
import fetchData from '../../../controllers/fetchData';
import mutateData from '../../../controllers/handleMutateData';
import SimpleTable from '../../../components/Table/SimpleTable';
import ViewFile from '../../../components/ExtraCells/Dialogs/ViewFile';
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import Head from 'next/head';
import AssignFileTask from '../../../components/Dialogs/AssignFileTask';
const tableHeading = ['filename', 'work type', 'supplier', 'assign date', 'assign to', 'view',];
const dataHeading = ['fileName', 'workType', 'supplier', 'assignDate', 'assignToName', '',];

function UpdateProduct() {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(20);
    const [selected, setSelected] = useState([]);
    const [backdropOpen, setBackdropOpen] = useState(false);
    const params = { page, rowsPerPage }

    const {
        data,
        error,
        mutate
    } = useSWR(`${baseURL}/api/files`, url => fetchData(url, params))
    const {
        data: employees,
        error: error1
    } = useSWR(`${baseURL}/api/employees`, fetchData);

    const handleChangePage = async (event, newPage) => {
        setBackdropOpen(true);
        setPage(parseInt(newPage));
        await mutateData(`${baseURL}/api/files`, params);
        mutate();
        setBackdropOpen(false);
    }
    const handleChangeRowsPerPage = async (event) => {
        setBackdropOpen(true);
        setRowsPerPage(parseInt(event.target.value, 10))
        setPage(parseInt(0))
        await mutateData(`${baseURL}/api/files`, params);
        mutate();
        setBackdropOpen(false);
    }

    const handleSelectChange = (event, row) => {
        if (event.target.checked) {
            setSelected([...selected, row]);
        } else {
            setSelected(selected.filter((p) => p._id !== row._id));
        }
    }
    const handleAllSelectChange = (event) => {
        if (event.target.checked) {
            setSelected([...new Set(selected.concat(data.data.map((p) => p)))]);
        } else {
            setSelected(
                selected.filter((s) => !data.data.map((p) => p._id).includes(s._id))
            );
        }
    }

    const handleUnassignClick = async () => {
        // setBackdropOpen(true);
        // if (selected.length > 0) {
        //   await axios
        //     .post(`${baseURL}/api/tasks`, { selected })
        //     .then(() => {
        //       setSelected([]);
        //       mutate();
        //       setBackdropOpen(false);
        //     })
        //     .catch((err) => {
        //       console.log(err)
        //     });
        // }
    };

    if (error || error1) {
        return <div>Error while fetching files</div>
    } else if (!data || !employees) {
        return <div>Please wait loading...</div>
    }
    
    return (
        <div>
            <Head>
                <title>Tasks By DealAyo</title>
            </Head>
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={backdropOpen}
            >
                <Stack alignItems="center" justifyContent="center" sx={{ mt: 3 }}>
                    <CircularProgress color="secondary" />
                    <Typography variant='h6'>loading...</Typography>
                </Stack>
            </Backdrop>
            <Stack direction="row" spacing={1.5} sx={{ mb: 1 }}>
                <Button
                    size="small"
                    variant="contained"
                    color="warning"
                    onClick={handleUnassignClick}
                    disabled={selected.length >= 1 ? false : true}
                >
                    <RemoveCircleOutlineIcon /> Unassign {selected.length}
                </Button>
                <AssignFileTask
                    selected={selected}
                    employees={employees.data}
                />
            </Stack>
            <SimpleTable
                tableHeading={tableHeading}
                dataHeading={dataHeading}
                data={data.data}
                page={page}
                rowsPerPage={rowsPerPage}
                totalCount={data.totalCount}
                handleChangePage={handleChangePage}
                handleChangeRowsPerPage={handleChangeRowsPerPage}
                ExtraCells={{ view: ViewFile }}
                type="selectable"
                selected={selected}
                onSelectChange={handleSelectChange}
                onAllSelectChange={handleAllSelectChange}
            />

        </div>
    )
}

export default UpdateProduct

