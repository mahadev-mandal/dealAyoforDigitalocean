import { Button, Stack } from '@mui/material';
import axios from 'axios';
import Cookies from 'js-cookie';
import React, { useState } from 'react'
import useSWR, { mutate } from 'swr';
import Table from '../../components/Table/Table'
import { baseURL } from '../../helpers/constants';

const tableHeading = ['ISBN', 'Title', 'Vendor', 'Category', 'MRP', 'SP', 'Entry Status', 'Entry Date'];
const dataHeading = ['model', 'title', 'vendor', 'category', 'MRP', 'SP', 'entryStatus', 'entryDate']

function Tasks() {
    const [shouldFetchDailyTasks, setShouldFetchDailyTasks] = useState(false);
    const fetchData = async (url) => {
        return await axios.post(url, {
            dealAyoId: Cookies.get('empId'),
        }).then((res) => res.data
        ).catch((err) => {
            throw new Error(err)
        })
    }
    const { data: products, error } = useSWR(shouldFetchDailyTasks ? `${baseURL}/api/tasks/${Cookies.get('empId')}` : null, fetchData);

    const handleStatusChange = async (event, _id) => {
        let date = null;
        if (event.target.checked) {
            date = new Date();
        } else {
            date = ''
        }
        await axios.put(`${baseURL}/api/products/${_id}`, {
            entryStatus: event.target.checked,
            date: date,
            dealAyoId: Cookies.get('empId')
        }).then(() => {
            mutate(`${baseURL}/api/tasks/${Cookies.get('empId')}`)
        }).catch((err) => {
            console.log(err)
        })
    }

    if (error) {
        return <div>Failed to load products</div>
    } else if (shouldFetchDailyTasks) {
        if (!products) {
            return <div>Please wait loading...</div>
        }
    }
    return (
        <div>
            <Stack spacing={2} sx={{ mb: 0.5 }} direction="row">
                <Button
                    variant="outlined"
                    onClick={() => setShouldFetchDailyTasks(true)}
                >
                    Get Daily Tasks
                </Button>
                <Button variant="outlined">Get Extra 5 Tasks</Button>
            </Stack>
            <Table
                tableHeading={tableHeading}
                dataHeading={dataHeading}
                data={products ? products : []}
                onStatusChange={handleStatusChange}
            />
        </div>
    )
}

export default (Tasks)