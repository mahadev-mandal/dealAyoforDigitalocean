import { Button, Stack } from '@mui/material';
import axios from 'axios';
import Head from 'next/head';
import React from 'react'
import { useState } from 'react';
import useSWR from 'swr';
import AddCategory from '../../components/Dialogs/CategoryDialogs/AddCategory';
import EditCategory from '../../components/Dialogs/CategoryDialogs/EditCategory';
import AreYouSureModal from '../../components/Dialogs/AreYouSure';
import SimpleTable from '../../components/Table/SimpleTable';
import fetchData from '../../controllers/fetchData';
import handleMutateData from '../../controllers/handleMutateData';
import { baseURL } from '../../helpers/constants';
import { withAuth } from '../../HOC/withAuth';
import BlockIcon from "@mui/icons-material/Block";

const tableHeading = ['Category Name', 'Time'];
const dataHeading = ['category', 'time',]


function Categories() {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(20);
    const [selected, setSelected] = useState([]);
    const params = { page, rowsPerPage }

    const {
        data: categories,
        error: error,
        mutate
    } = useSWR(`${baseURL}/api/categories`, url => fetchData(url, params))


    const handleSelectChange = (event, row) => {
        if (event.target.checked) {
            setSelected([...selected, row]);
        } else {
            setSelected(selected.filter((p) => p._id !== row._id));
        }
    }
    const handleAllSelectChange = (event) => {
        if (event.target.checked) {
            setSelected([...new Set(selected.concat(categories.data.map((p) => p)))]);
            
        } else {
            setSelected(
                selected.filter((s) => !categories.data.map((p) => p._id).includes(s._id))
            );
        }
    }

    const handleChangePage = async (event, newPage) => {
        setPage(parseInt(newPage));
        await handleMutateData(`${baseURL}/api/categories`, params);
        mutate();
    }
    const handleChangeRowsPerPage = async (event) => {
        setRowsPerPage(parseInt(event.target.value, 10))
        setPage(parseInt(0))
        await handleMutateData(`${baseURL}/api/categories`, params);
        mutate();
    }
    const handleClickYes = async (type) => {
        if (type === "delete") {
            axios
                .delete(`${baseURL}/api/categories`, {
                    data: { _ids: selected },
                })
                .then(() => {
                    mutate();
                });
        }
    };

    if (error) {
        return <div>Failed to load categories details</div>
    } else if (!categories) {
        return <div>Please wait Loading...</div>
    }
    console.log(selected)
    return (
        <div>
            <Head>
                <title>Tasks By DealAyo</title>
            </Head>
            <Stack direction="row" spacing={1} sx={{ mb: 0.5 }}>
                <Button
                    size="small"
                    variant="contained"
                    color="warning"
                    disabled={selected.length >= 1 ? false : true}
                >
                    <BlockIcon />
                    Disable {selected.length}
                </Button>
                <AreYouSureModal
                    title={`Are you sure want to delete ${selected.length} categories`}
                    selected={selected}
                    handleClickYes={() => handleClickYes("delete")}
                />
                <EditCategory
                    categoryDetails={selected.length === 1 ? selected[0] : {}}
                    disabled={selected.length != 1}
                />
                <AddCategory />
            </Stack>
            <SimpleTable
                tableHeading={tableHeading}
                dataHeading={dataHeading}
                data={categories.data}
                page={page}
                rowsPerPage={rowsPerPage}
                totalCount={categories.totalCount}
                handleChangePage={handleChangePage}
                handleChangeRowsPerPage={handleChangeRowsPerPage}
                type='selectable'
                onSelectChange={handleSelectChange}
                onAllSelectChange={handleAllSelectChange}
                selected={selected}
            />
        </div>
    )
}

export default withAuth(Categories)