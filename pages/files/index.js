import { Stack } from '@mui/material'
import React, { useState } from 'react'
import UploadFileDialog from '../../components/Dialogs/UploadFile'
import useSWR from 'swr';
import { baseURL } from '../../helpers/constants';
import fetchData from '../../controllers/fetchData';
import mutateData from '../../controllers/handleMutateData';
import SimpleTable from '../../components/Table/SimpleTable';
import ViewFile from '../../components/ExtraCells/Dialogs/ViewFile';

const tableHeading = ['filename', 'work type', 'supplier', 'assign date', 'assign to', 'view',];
const dataHeading = ['fileName', 'workType', 'supplier', 'assignDate', 'assignToName', '',];

function UpdateProduct() {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(20);
    const params = { page, rowsPerPage }

    const {
        data,
        error,
        mutate
    } = useSWR(`${baseURL}/api/files`, url => fetchData(url, params))

    const handleChangePage = async (event, newPage) => {
        setPage(parseInt(newPage));
        await mutateData(`${baseURL}/api/files`, params);
        mutate();
    }
    const handleChangeRowsPerPage = async (event) => {
        setRowsPerPage(parseInt(event.target.value, 10))
        setPage(parseInt(0))
        await mutateData(`${baseURL}/api/files`, params);
        mutate();
    }

    if (error) {
        return <div>Error while fetching files</div>
    } else if (!data) {
        return <div>Please wait loading...</div>
    }
    return (
        <div>
            <Stack direction="row" spacing={1.5} sx={{ mb: 1 }}>
                <UploadFileDialog />
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
            />

        </div>
    )
}

export default UpdateProduct

