import { Stack } from '@mui/material'
import React from 'react'
import useSWR from 'swr'
import CommentModal from '../../components/CommentModal/CommentModal'
import FilterByDate from '../../components/FilterByDate'
import AttendanceTable from '../../components/Table/AttendanceTable'
import fetchData from '../../controllers/fetchData'
import { baseURL } from '../../helpers/constants'

const tableHeading = ['date', 'day', '', 'name', 'Id', 'comment',];
const dataHeading = ['date', 'name', 'dealAyoId', 'comment'];

function WorkSheet() {

    const {
        data,
        error,
        mutate
    } = useSWR(`${baseURL}/api/worksheet`, fetchData);

    if (error) {
        return <div>Error occured while fetching worksheet details</div>
    } else if (!data) {
        return <div>Please wait fetching workSheet details</div>
    }
    return (
        <div>
            <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                <FilterByDate

                />
                <CommentModal
                    collName="attendance"
                    mutate={mutate}
                />
            </Stack>
            <AttendanceTable
                tableHeading={tableHeading}
                dataHeading={dataHeading}
                data={data.data}
            />
        </div>
    )
}

export default WorkSheet