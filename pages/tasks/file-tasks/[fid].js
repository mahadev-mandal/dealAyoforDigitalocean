import { Stack } from '@mui/material'
import React, { useState } from 'react'
import useSWR from 'swr';
import { baseURL } from '../../../helpers/constants';
import fetchData from '../../../controllers/fetchData';
import mutateData from '../../../controllers/handleMutateData';
import SimpleTable from '../../../components/Table/SimpleTable';
import ViewFile from '../../../components/ExtraCells/Dialogs/ViewFile';
import { useRouter } from 'next/router';
import ReturnDate from '../../../components/ExtraCells/ReturnDate';
import FileRemarks from '../../../components/ExtraCells/Dialogs/fileRemarks';
import DoneStatus from '../../../components/ExtraCells/DoneStatus';

const tableHeading = ['filename', 'work type', 'supplier', 'assignDate', 'assign to', 'doneStatus', 'view', 'remarks'];
const dataHeading = ['fileName', 'workType', 'supplier', '', 'assignToName', '', '',''];

function UpdateProduct() {
    const router = useRouter();
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(20);
    const params = { page, rowsPerPage }
    const { fid } = router.query;
    const {
        data,
        error,
        mutate
    } = useSWR(`${baseURL}/api/tasks/file-tasks/${fid}`, url => fetchData(url, params))

    const handleChangePage = async (event, newPage) => {
        setPage(parseInt(newPage));
        await mutateData(`${baseURL}/api/tasks/file-tasks`, params);
        mutate();
    }
    const handleChangeRowsPerPage = async (event) => {
        setRowsPerPage(parseInt(event.target.value, 10))
        setPage(parseInt(0))
        await mutateData(`${baseURL}/api/tasks/file-tasks`, params);
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
                ExtraCells={{ view: ViewFile, remarks: FileRemarks, assignDate: ReturnDate, doneStatus: DoneStatus }}
            />

        </div>
    )
}

export default UpdateProduct

