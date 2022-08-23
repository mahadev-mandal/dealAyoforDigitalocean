import axios from 'axios';
import React, { useState } from 'react'
import useSWR from 'swr';
import Table from '../../components/Table/Table'
import countTotalData from '../../controllers/countTotalData';
import handleRowsPageChange from '../../controllers/handleRowsPageChange';
import { baseURL } from '../../helpers/constants';


const tableHeading = ['model', 'title', 'vendor', 'category', 'MRP', 'SP', 'Assign to', 'entry status',];
const dataHeading = ['model', 'title', 'vendor', 'category', 'MRP', 'SP', 'assignTo', 'entryStatus',]

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
    const { data: products, error: error1, mutate: mutateProducts } = useSWR(`${baseURL}/api/products`, fetchData);
    const { data: totalCount, error: error2, mutate: mutateCounts } = useSWR(`${baseURL}/api/count-data`,
        url => countTotalData(url, 'products')
    );

    const handleChangePage = async (event, newPage) => {
        setPage(newPage)
        handleRowsPageChange(`${baseURL}/api/products`, params, mutateProducts)
    }
    const handleChangeRowsPerPage = async (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
        handleRowsPageChange(`${baseURL}/api/products`, params, mutateProducts)
    }

    const handleStatusChange = async (event, _id) => {
        //only allow to tick check box if work in not ended

        let date = null;
        await axios.put(`${baseURL}/api/products/${_id}`, {
            entryStatus: event.target.checked,
            date: date,
        }).then(() => {
            mutateProducts()
        }).catch((err) => {
            console.log(err)
        })
    }

    if (error1 || error2) {
        return <div>Failed to load products</div>
    } else if (!products || !totalCount) {
        if (totalCount < 1) {
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
                collectionName="products"
                mutateData={mutateProducts}
                mutateCounts={mutateCounts}
                onStatusChange={handleStatusChange}
            />
        </div>
    )
}

export default Products