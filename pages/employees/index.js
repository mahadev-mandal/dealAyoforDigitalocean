import axios from 'axios';
import React from 'react'
import useSWR from 'swr';
import AddEmployee from '../../components/AddEmployeeModal';
import Table from '../../components/Table/Table'
import { baseURL } from '../../helpers/constants';

const tableHeading = ['DealAyoId', 'mobile', 'email', 'start time', 'end time', 'tasks decr',];
const dataHeading = ['dealAyoId', 'mobile', 'email', 'startTime', 'endTime', 'decreaseTask']


export default function Employees() {
  const fetchData = async (url) => {
    return await axios.get(url)
      .then((res) => res.data).catch((err)=>{throw new Error(err)})
  }
  const { data: employees, error } = useSWR(`${baseURL}/api/employees`, fetchData)
  if(error){
    return <div>Failed to load Employees details</div>
  }else if(!employees){
    return <div>Please wait Loading...</div>
  }
  console.log(employees)
  return (
    <div>
      <AddEmployee />
      <Table
        tableHeading={tableHeading}
        dataHeading={dataHeading}
        data={employees}
      />
    </div>
  )
}
