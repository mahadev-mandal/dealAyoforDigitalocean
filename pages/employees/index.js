import { Button, Stack } from '@mui/material';
import axios from 'axios';
import Head from 'next/head';
import React from 'react'
import { useState } from 'react';
import useSWR from 'swr';
import BlockIcon from "@mui/icons-material/Block";
import AddEmployee from '../../components/Dialogs/EmployeeDialogs/AddEmployee';
import EditEmployee from '../../components/Dialogs/EmployeeDialogs/EditEmployee';
import AreYouSureModal from '../../components/Dialogs/AreYouSure';
import SimpleTable from '../../components/Table/SimpleTable';
import handleMutateData from '../../controllers/handleMutateData';
import { baseURL } from '../../helpers/constants';
import { withAuth } from '../../HOC/withAuth';
import ShowProfile from '../../components/ExtraCells/showProfile';

const tableHeading = ['DealAyoId', 'mobile', 'email', 'start time', 'end time', 'tasks decr', 'profile'];
const dataHeading = ['dealAyoId', 'mobile', 'email', 'startTime', 'endTime', 'decreaseTask', '']


function Employees() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [selected, setSelected] = useState([]);

  const params = { page, rowsPerPage }

  const fetchData = async (url) => {
    return await axios.get(url, { params })
      .then((res) => res.data).catch((err) => { throw new Error(err) })
  }
  const {
    data: employees,
    error: error, mutate
  } = useSWR(`${baseURL}/api/employees`, fetchData)

  const handleSelectChange = (event, row) => {
    if (event.target.checked) {
      setSelected([...selected, row]);
    } else {
      setSelected(selected.filter((p) => p._id !== row._id));
    }
  }
  const handleAllSelectChange = (event) => {
    if (event.target.checked) {
      setSelected([...new Set(selected.concat(employees.data.map((p) => p)))]);
    } else {
      setSelected(
        selected.filter((s) => !employees.data.map((p) => p._id).includes(s._id))
      );
    }
  }

  const handleChangePage = async (event, newPage) => {
    setPage(parseInt(newPage));
    await handleMutateData(`${baseURL}/api/employees`, params);
    mutate();
  }
  const handleChangeRowsPerPage = async (event) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(parseInt(0))
    await handleMutateData(`${baseURL}/api/employees`, params);
    mutate();
  }
  const handleClickYes = async (type) => {
    if (type === "delete") {
      axios
        .delete(`${baseURL}/api/employees`, {
          data: { _ids: selected },
        })
        .then(() => {
          mutate();
        });
    }
  };

  if (error) {
    return <div>Failed to load Employees details</div>
  } else if (!employees) {

    return <div>Please wait Loading...</div>
  }
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
          title={`Are you sure want to delete ${selected.length} employees`}
          selected={selected}
          handleClickYes={() => handleClickYes("delete")}
        />
        <EditEmployee
          empDetails={selected.length === 1 ? selected[0] : {}}
          disabled={selected.length != 1}
        />
        <AddEmployee />
      </Stack>
      <SimpleTable
        tableHeading={tableHeading}
        dataHeading={dataHeading}
        data={employees.data}
        page={page}
        rowsPerPage={rowsPerPage}
        totalCount={employees.totalCount}
        handleChangePage={handleChangePage}
        handleChangeRowsPerPage={handleChangeRowsPerPage}
        type='selectable'
        onSelectChange={handleSelectChange}
        onAllSelectChange={handleAllSelectChange}
        selected={selected}
        ExtraCells={{ profile: ShowProfile }}
      />
    </div>
  )
}

export default withAuth(Employees)