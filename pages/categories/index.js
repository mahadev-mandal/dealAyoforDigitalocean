import axios from 'axios';
import Cookies from 'js-cookie';
import React from 'react'
import { useState } from 'react';
import useSWR from 'swr';
import Table from '../../components/Table/Table'
import countTotalData from '../../controllers/countTotalData';
import handleRowsPageChange from '../../controllers/handleRowsPageChange';
import parseJwt from '../../controllers/parseJwt';
import { baseURL } from '../../helpers/constants';

const tableHeading = ['Category Name', 'Time'];
const dataHeading = ['category', 'time',]


function Categories() {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(20);
    const params = { page, rowsPerPage }

    const fetchData = async (url) => {
        return await axios.get(url, { params })
            .then((res) => res.data).catch((err) => { throw new Error(err) })
    }
    const { data: categories, error: error1, mutate:mutateCategories } = useSWR(`${baseURL}/api/categories`, fetchData)
    const { data: totalCount, error: error2, mutate:mutateTotalCount } = useSWR(`${baseURL}/api/count-data`,
        url => countTotalData(url, 'categories')
    )
    
    const handleChangePage = (event, newPage) => {
        setPage(parseInt(newPage));
        handleRowsPageChange(`${baseURL}/api/categories`, params, mutateCategories)
    }
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10))
        setPage(parseInt(0))
        handleRowsPageChange(`${baseURL}/api/categories`, params, mutateCategories)
    }

    if (error1 || error2) {
        return <div>Failed to load categories details</div>
    } else if (!categories || !totalCount) {
        if (totalCount < 1) {
            return <div>categories not found</div>
        }
        return <div>Please wait Loading...</div>
    }

    if (parseJwt(Cookies.get('token')).role === 'admin' || parseJwt(Cookies.get('token')).role === 'super-admin') {
        return (
            <div>
                <Table
                    tableHeading={tableHeading}
                    dataHeading={dataHeading}
                    data={categories}
                    page={page}
                    rowsPerPage={rowsPerPage}
                    totalCount={totalCount}
                    handleChangePage={handleChangePage}
                    handleChangeRowsPerPage={handleChangeRowsPerPage}
                    collectionName="categories"
                    mutateCounts={mutateTotalCount}
                    mutateData={mutateCategories}
                />
            </div>
        )
    } else {
        return <div>Your are not Admin</div>
    }
}

export default Categories