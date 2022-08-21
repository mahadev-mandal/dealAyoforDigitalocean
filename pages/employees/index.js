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

const tableHeading = ['DealAyoId', 'mobile', 'email', 'start time', 'end time', 'tasks decr',];
const dataHeading = ['dealAyoId', 'mobile', 'email', 'startTime', 'endTime', 'decreaseTask']


function Employees() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const params = { page, rowsPerPage }

  const fetchData = async (url) => {
    return await axios.get(url, { params })
      .then((res) => res.data).catch((err) => { throw new Error(err) })
  }
  const { data: employees, error: error1, mutate } = useSWR(`${baseURL}/api/employees`, fetchData)
  const { data: totalCount, error: error2 } = useSWR(`${baseURL}/api/count-data`,
    url => countTotalData(url, 'employees')
  )

  const handleChangePage = (event, newPage) => {
    setPage(parseInt(newPage));
    handleRowsPageChange(`${baseURL}/api/employees`, params, mutate)
  }
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(parseInt(0))
    handleRowsPageChange(`${baseURL}/api/employees`, params, mutate)
  }

  if (error1 || error2) {
    return <div>Failed to load Employees details</div>
  } else if (!employees || !totalCount) {
    if (totalCount < 1) {
      return <div>Employees not found</div>
    }
    return <div>Please wait Loading...</div>
  }

  if (parseJwt(Cookies.get('token')).role === 'admin' || parseJwt(Cookies.get('token')).role === 'super-admin') {
    return (
      <div>
        <Table
          tableHeading={tableHeading}
          dataHeading={dataHeading}
          data={employees}
          page={page}
          rowsPerPage={rowsPerPage}
          totalCount={totalCount}
          handleChangePage={handleChangePage}
          handleChangeRowsPerPage={handleChangeRowsPerPage}
          collectionName="employees"
        />
      </div>
    )
  } else {
    return <div>Your are not Admin</div>
  }
}

export default Employees