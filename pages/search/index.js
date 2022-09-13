import axios from 'axios';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React from 'react'
import Table from '../../components/Table/Table'
import { baseURL } from '../../helpers/constants';
import { withAuth } from '../../HOC/withAuth';


const tableHeading = ['model', 'title', 'category', 'MRP', 'SP', 'Assign to', 'entry status', 'assign Date'];
const dataHeading = ['model', 'title', 'category', 'MRP', 'SP', 'assignToName', 'entryStatus',]

function Products() {
    const router = useRouter();
    const { searchText, pid } = router.query;

    const handleStatusChange = async (event, _id) => {
        //only allow to tick check box if work in not ended

        let date = null;
        await axios.put(`${baseURL}/api/products/${_id}`, {
            entryStatus: event.target.checked,
            date: date,
        }).then(() => {

        }).catch((err) => {
            console.log(err)
        })
    }

    return (
        <div>
            <Head>
                <title>Tasks By DealAyo</title>
            </Head>
            <Table
                tableHeading={tableHeading}
                dataHeading={dataHeading}
                collectionName={`search?searchText=${searchText}&pid=${pid}`}
                onStatusChange={handleStatusChange}
                defaultEmpFilter=""
                defaultAssignFilter=""
            />
        </div>
    )
}

export default withAuth(Products)