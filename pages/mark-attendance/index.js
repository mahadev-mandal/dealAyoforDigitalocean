import axios from 'axios';
import Cookies from 'js-cookie';
import React from 'react'
import useSWR from 'swr';
import TodayTable from '../../components/Table/TodayTable';
import parseJwt from '../../controllers/parseJwt';
import { baseURL } from '../../helpers/constants';
import { withAuth } from '../../HOC/withAuth';

const tableHeading = ['Emp Id', 'Name', 'Working hrs', 'Entry', 'Exit', 'Tasks Assigned', 'Tasks Completed', 'Extra Tasks'];
const dataHeading = ['dealAyoId', 'firstName', 'workingHrs', 'entryTime', 'exitTime', 'tasksAssigned', 'tasksCompleted', 'extraTasksCompleted'];

function Today() {
  const dateFrom = new Date().setHours(0, 0, 0, 0);
  const dateTo = new Date().setHours(24)

  const fetchData = async (url) => {
    return await axios.get(url)
      .then((res) => res.data)
  }
  const fetchAttend = async (url) => {
    return await axios.get(url, {
      params: {
        dateFrom: new Date(dateFrom),
        dateTo: new Date(dateTo)
      }
    }).then((res) => res.data)
  }

  const { data: empDetails, error: error1 } = useSWR(`${baseURL}/api/employees`, fetchData)
  const { data: attendance, error: error2 } = useSWR(`${baseURL}/api/mark-attendance`, fetchAttend)

  let data;
  let d;
  // MERGE emp details and attendance data


  if (error1 || error2) {
    return <div>Failed to load employees details</div>
  } else if ((!empDetails || !attendance)) {
    return <div>Please wait loading...</div>
  }

  if (attendance.length > 0) {
    d = empDetails.map(emp => ({ ...emp, ...attendance[0].employees.find(attend => attend.dealAyoId === emp.dealAyoId) }));
    if (parseJwt(Cookies.get('token')).role === 'admin' || parseJwt(Cookies.get('token')).role === 'super-admin') {
      data = d
    }
    // Only make able to mark his/her attendance if he/she is not admin or super-admin
    else {
      data = d.filter(e => e.dealAyoId === parseJwt(Cookies.get('token')).dealAyoId)
    }
  } else {
    data = empDetails
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

export default withAuth(Today)