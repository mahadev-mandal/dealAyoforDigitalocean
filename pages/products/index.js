import axios from 'axios';
import React from 'react'
import useSWR from 'swr';
import Table from '../../components/Table/Table'
import { baseURL } from '../../helpers/constants';

const tableHeading = ['model', 'title', 'vendor', 'category', 'MRP', 'SP', 'entry status',];
const dataHeading = ['model', 'title', 'vendor', 'category', 'MRP', 'SP', 'entryStatus']

function Products() {
    const fetchData = async (url) => {
        return await axios.get(url)
            .then((res) => res.data)
            .catch((err) => {
                throw new Error(err)
            })
    }
    const { data: products, error } = useSWR(`${baseURL}/api/products`, fetchData);
    
    if (error) {
        return <div>Failed to load products</div>
    } else if (!products) {
        return <div>Please wait loading...</div>
    }
    return (
        <div>
            <Table
                tableHeading={tableHeading}
                dataHeading={dataHeading}
                data={products}
            />
        </div>
    )
}

export default Products