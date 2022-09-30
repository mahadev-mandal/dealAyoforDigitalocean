import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useState } from 'react'
import { baseURL } from '../../helpers/constants';
import { withAuth } from '../../HOC/withAuth';
import SimpleTable from '../../components/Table/SimpleTable';
import useSWR from 'swr';
import fetchData from '../../controllers/fetchData'
import { Backdrop, CircularProgress, Stack, Typography } from '@mui/material';
import handleMutateData from '../../controllers/handleMutateData';
import ReturnDate from '../../components/ExtraCells/ReturnDate';
import Remarks from '../../components/ExtraCells/Dialogs/Remarks'
import { useEffect } from 'react';


const tableHeading = ['model', 'title', 'category', 'brand', 'MRP', 'SP', 'Assign to', 'entry status', 'assignDate', 'remarks'];
const dataHeading = ['model', 'title', 'category', 'brand', 'MRP', 'SP', 'assignToName', 'entryStatus', '', '']

function Products() {
    const router = useRouter();
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(20);
    const [backdropOpen, setBackdropOpen] = useState(false);
    const { searchText, pid } = router.query;
    const params = { page, rowsPerPage, searchText, pid };

    const {
        data,
        error,
        mutate
    } = useSWR(`${baseURL}/api/search`, url => fetchData(url, params))

    const handleChangePage = async (event, newPage) => {
        setBackdropOpen(true);
        setPage(parseInt(newPage));
        await handleMutateData(`${baseURL}/api/search`, params);
        mutate();
        setBackdropOpen(false);
    }
    const handleChangeRowsPerPage = async (event) => {
        setBackdropOpen(true);
        setRowsPerPage(parseInt(event.target.value, 10))
        setPage(parseInt(0))
        await handleMutateData(`${baseURL}/api/search`, params);
        mutate();
        setBackdropOpen(false);
    }
    useEffect(() => {
        

    })
    if (error) {
        return <div>Error while fetching product</div>
    } else if (!data) {
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
            <SimpleTable
                tableHeading={tableHeading}
                dataHeading={dataHeading}
                page={page}
                rowsPerPage={rowsPerPage}
                data={data.data}
                totalCount={data.totalCount}
                handleChangePage={handleChangePage}
                handleChangeRowsPerPage={handleChangeRowsPerPage}
                ExtraCells={{ assignDate: ReturnDate, remarks: Remarks }}
            />
        </div>
    )
}

export default withAuth(Products)