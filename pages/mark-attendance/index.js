import axios from 'axios';
import React from 'react'
import useSWR from 'swr';
import TodayTable from '../../components/Table/TodayTable';
import { baseURL } from '../../helpers/constants';

const tableHeading = ['Emp Id', 'Name', 'Working hrs', 'Entry', 'Exit', 'Tasks Assigned', 'Tasks Completed', 'Extra Tasks'];
const dataHeading = ['dealAyoId', 'firstName', 'workingHrs', 'entryTime', 'exitTime', 'tasksAssigned', 'tasksCompleted', 'extraTasksCompleted'];

export default function Today() {
  const dateFrom = new Date().setHours(0, 0, 0, 0);
  const dateTo = new Date().setHours(24)

  const fetchData = async (url) => {
    return await axios.get(url)
      .then((res) => res.data)
  }
  const updateOrFetchAttend = async (url) => {
    return await axios.post(url, { dateFrom, dateTo })
      .then((res) => res.data)
  }

  const { data: empDetails, error: error1 } = useSWR(`${baseURL}/api/employees`, fetchData)
  const { data: attendance, error: error2 } = useSWR(`${baseURL}/api/attendance`, updateOrFetchAttend)

  let data;
  if (attendance) {
    if (attendance.length > 0) {
      data = empDetails.map(emp => ({ ...emp, ...attendance[0].employees.find(attend => attend.dealAyoId === emp.dealAyoId) }))
    } else {
      data = empDetails
    }
  }
  if (error1 || error2) {
    return <div>Failed to load employees details</div>
  } else if (!data) {
    return <div>Please wait loading...</div>
  }

  return (
    <div>
      <TodayTable
        tableHeading={tableHeading}
        dataHeading={dataHeading}
        data={data}
      />
    </div>
  )
}
