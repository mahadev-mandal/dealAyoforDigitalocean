import axios from 'axios';
import React from 'react'
import useSWR from 'swr';
import CustomizedTables from '../../components/Table/Table'
import { baseURL } from '../../helpers/constants';

const tableHeading = ['model','title', 'vendor', 'category', 'MRP', 'SP', 'status',];

function Tasks() {
    const fetchData = async (url) => {
        return await axios.get(url)
            .then((res) => res.data)
            .catch((err) => {
                throw new Error(err)
            })
    }
    const { data: products, error } = useSWR(`${baseURL}/api/tasks/abc`, fetchData);
    console.log(products)
    console.log(error)
    if (error) {
        return <div>Failed to load products</div>
    } else if (!products) {
        return <div>Please wait loading...</div>
    }
    return (
        <div>
            <CustomizedTables tableHeading={tableHeading} data={products} />
        </div>
    )
}

export default Tasks