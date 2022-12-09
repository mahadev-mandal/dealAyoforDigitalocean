import { Button, Stack } from '@mui/material';
import axios from 'axios';
import Head from 'next/head';
import React from 'react'
import { useState } from 'react';
import useSWR from 'swr';
import AddEmployee from '../../components/Dialogs/EmployeeDialogs/AddEmployee';
import EditEmployee from '../../components/Dialogs/EmployeeDialogs/EditEmployee';
import AreYouSureModal from '../../components/Dialogs/AreYouSure';
import SimpleTable from '../../components/Table/SimpleTable';
import handleMutateData from '../../controllers/handleMutateData';
import { baseURL } from '../../helpers/constants';
import { withAuth } from '../../HOC/withAuth';
import ShowProfile from '../../components/ExtraCells/ShowProfile';
import ReturnStatus from '../../components/ExtraCells/ReturnStatus';

const tableHeading = ['DealAyoId', 'name', 'mobile', 'email', 'start time', 'end time', 'role', 'status', 'profile'];
const dataHeading = ['dealAyoId', 'firstName', 'mobile', 'email', 'startTime', 'endTime', 'role', '', '']


function Employees() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [selected, setSelected] = useState([]);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const params = { page, rowsPerPage, type: 'all' }

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
          setSelected([])
          setDeleteOpen(false);
          mutate();
        });
    }
  };
  const handleEmployeeDisable = async () => {
    await axios.put(`${baseURL}/api/employees/${selected[0]._id}`, { status: !selected[0].status, enableOrDisable: true })
      .then(() => {
        console.log(selected[0].dealAyoId)
        alert(`${selected[0].firstName} ${selected[0].status ? 'Disabled' : 'Enabled'}`)
      }).catch((err) => {
        throw new Error(err);
      })
  }

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
        {selected.length > 0 &&
          <Button
            size="small"
            variant="contained"
            color="warning"
            disabled={selected.length > 1}
            onClick={handleEmployeeDisable}
          >
            {selected[0].status ? 'Disable' : 'Enable'} {selected.length}
          </Button>}
        <AreYouSureModal
          title={`Are you sure want to delete ${selected.length} employees`}
          selected={selected}
          handleClickYes={() => handleClickYes("delete")}
          open={deleteOpen}
          onOpen={() => setDeleteOpen(true)}
          onClose={() => setDeleteOpen(false)}
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
        ExtraCells={{ profile: ShowProfile, status: ReturnStatus }}
      />
    </div>
  )
}

export default withAuth(Employees)