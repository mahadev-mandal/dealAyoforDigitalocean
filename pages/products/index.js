import axios from 'axios';
import React, { useState } from 'react'
import useSWR from 'swr';
import Table from '../../components/Table/Table'
import countTotalData from '../../controllers/countTotalData';
import handleRowsPageChange from '../../controllers/handleRowsPageChange';
import { baseURL } from '../../helpers/constants';

const tableHeading = ['model', 'title', 'vendor', 'category', 'MRP', 'SP', 'entry status', 'Assign to'];
const dataHeading = ['model', 'title', 'vendor', 'category', 'MRP', 'SP', 'entryStatus', 'assignTo']

function Products() {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(20);
    const params = { page, rowsPerPage };

    const fetchData = async (url) => {
        return await axios.get(url, { params })
            .then((res) => res.data)
            .catch((err) => {
                throw new Error(err)
            })
    }
    const { data: products, error: error1, mutate } = useSWR(`${baseURL}/api/products`, fetchData);
    const { data: totalCount, error: error2 } = useSWR(`${baseURL}/api/count-data`,
        url => countTotalData(url, 'products')
    );

    const handleChangePage = async (event, newPage) => {
        setPage(newPage)
        handleRowsPageChange(`${baseURL}/api/products`, params, mutate)
    }
    const handleChangeRowsPerPage = async (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
        handleRowsPageChange(`${baseURL}/api/products`, params, mutate)
    }

    if (error1 || error2) {
        return <div>Failed to load products</div>
    } else if (!products || !totalCount) {
        if(totalCount<1){
            return <div>Products not found</div>
        }
        return <div>Please wait loading...</div>
    }
    return (
        <div>
            <Table
                tableHeading={tableHeading}
                dataHeading={dataHeading}
                data={products}
                page={page}
                rowsPerPage={rowsPerPage}
                totalCount={totalCount}
                handleChangePage={handleChangePage}
                handleChangeRowsPerPage={handleChangeRowsPerPage}
            />
        </div>
    )
}

export default Products