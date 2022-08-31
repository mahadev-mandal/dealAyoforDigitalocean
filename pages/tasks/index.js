import axios from 'axios';
import React, { useState } from 'react'
import useSWR from 'swr';
import CustomizedTables from '../../components/Table/Table'
import { baseURL } from '../../helpers/constants';
import handleRowsPageChange from '../../controllers/handleRowsPageChange';
import countTotalData from '../../controllers/countTotalData';
import { withAuth } from '../../HOC/withAuth';

const tableHeading = ['model', 'title', 'vendor', 'category', 'MRP', 'SP', 'assign to', 'Entry status',];
const dataHeading = ['model', 'title', 'vendor', 'category', 'MRP', 'SP', 'assignToName', 'entryStatus',];

function Tasks() {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(20);
    const params = { page, rowsPerPage };

    const fetchData = async (url) => {
        return await axios.get(url)
            .then((res) => res.data)
            .catch((err) => {
                throw new Error(err)
            })
    }
    const { data: products, error1, mutate } = useSWR(`${baseURL}/api/tasks`, fetchData);
    const { data: totalCount, error2 } = useSWR(`${baseURL}/api/count-data`,
        url => countTotalData(url, 'tasks')
    )

    const handleChangePage = (event, newPage) => {
        setPage(parseInt(newPage))
        handleRowsPageChange(`${baseURL}/api/tasks`, params, mutate)
    }
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10))
        setPage(0)
        handleRowsPageChange(`${baseURL}/api/tasks`, params, mutate)
    }
    const handleStatusChange = async (event, _id) => {
        //only allow to tick check box if work in not ended
        let date = null;
        if (event.target.checked) {
            date = new Date();
        } else {
            date = ''
        }
        await axios.put(`${baseURL}/api/products/${_id}`, {
            entryStatus: event.target.checked,
            date: date,
        }).then(() => {
            mutate()
        }).catch((err) => {
            console.log(err)
        })
    }
    if (error1 || error2) {
        return <div>Failed to load products</div>
    } else if (!products || !totalCount) {
        if (totalCount < 1) {
            return <div>No tasks assigned today</div>
        }
        return <div>Please wait loading...</div>
    }

    return (
        <div>
            <CustomizedTables
                tableHeading={tableHeading}
                data={products.length > 0 ? products : []}
                dataHeading={dataHeading}
                page={page}
                rowsPerPage={rowsPerPage}
                handleChangePage={handleChangePage}
                handleChangeRowsPerPage={handleChangeRowsPerPage}
                totalCount={totalCount}
                onStatusChange={handleStatusChange}
            />
        </div>
    )
}

export default withAuth(Tasks)