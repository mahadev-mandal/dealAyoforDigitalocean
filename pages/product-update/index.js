import { Stack } from '@mui/material'
import React from 'react'
import FullScreenDialog from '../../components/FullScreenDialog/FullScreenDialog'
import UploadFileDialog from '../../components/UploadFileDialog'

function UpdateProduct() {
    return (
        <div>
            <Stack direction="row" spacing={1.5}>
                <FullScreenDialog 
                    collName="product-update"
                />
                <UploadFileDialog />
            </Stack>
        </div>
    )
}

export default UpdateProduct