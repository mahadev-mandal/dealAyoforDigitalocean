import React from 'react'
import CustomizedTables from '../../components/Table/Table'

const tableHeading = ['product_name', 'vendor', 'category', 'quantity', 'price1', 'price2', 'barcode', 'status', 'entry_date', 'entry_by', 'last_update', 'last_update_by', 'entry_status'];

const data = [
    {
        product_name: 'aModern-day Miracles: Miraculous Moments and Extraordinary Stories from People All Over the World Whose Lives Have Been Touched by Louise Hay',
        vendor: 'vp-22',
        category: 'book',
        quantity: 5,
        price1: 5000,
        price2: 4000,
        barcode: '89439843',
        status: 'active',
        entry_date: '2/4/2022',
        entry_by: 'Adit',
        last_update: '5/5/2022',
        last_update_by: 'jenish',
        entry_status: 'done',
    },
]

function Products() {
    return (
        <div>
            <CustomizedTables tableHeading={tableHeading} data={data} />
        </div>
    )
}

export default Products