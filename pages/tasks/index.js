import axios from 'axios';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import React, { useState } from 'react'
import useSWR from 'swr';
import CustomizedTables from '../../components/Table/Table'
import parseJwt from '../../controllers/parseJwt';
import { baseURL } from '../../helpers/constants';
import handleRowsPageChange from '../../controllers/handleRowsPageChange';
import countTotalData from '../../controllers/countTotalData';

const tableHeading = ['model', 'title', 'vendor', 'category', 'MRP', 'SP','assign to', 'Entry status',];
const dataHeading = ['model', 'title', 'vendor', 'category', 'MRP', 'SP', 'assignTo','entryStatus', ];

function Tasks() {
    const router = useRouter();

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(20);
    const params = { page, rowsPerPage };

    if (parseJwt(Cookies.get('token')).role === 'data-entry') {
        router.push(`${baseURL}/tasks/${parseJwt(Cookies.get('token'))._id}`)
    }

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
console.log()
    if (error1 || error2) {
        return <div>Failed to load products</div>
    } else if (!products || !totalCount) {
        if(totalCount<1){
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
            />
        </div>
    )
}

export default Tasks