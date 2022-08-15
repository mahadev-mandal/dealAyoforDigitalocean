import axios from 'axios';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import React from 'react'
import useSWR from 'swr';
import CustomizedTables from '../../components/Table/Table'
import parseJwt from '../../controllers/parseJwt';
import { baseURL } from '../../helpers/constants';

const tableHeading = ['model', 'title', 'vendor', 'category', 'MRP', 'SP', 'status',];
const dataHeading = ['model', 'title', 'vendor', 'category', 'MRP', 'SP', 'status'];

function Tasks() {
    const router = useRouter();

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
    const { data: products, error } = useSWR(`${baseURL}/api/tasks`, fetchData);

    if (error) {
        return <div>Failed to load products</div>
    } else if (!products) {
        return <div>Please wait loading...</div>
    }

    return (
        <div>
            <CustomizedTables
                tableHeading={tableHeading}
                data={products.length > 0 ? products : []}
                dataHeading={dataHeading}
            />
        </div>
    )
}

export default Tasks