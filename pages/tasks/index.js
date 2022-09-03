import axios from "axios";
import React, { useState } from "react";
import useSWR from "swr";
import CustomizedTables from "../../components/Table/Table";
import { baseURL } from "../../helpers/constants";
import handleRowsPageChange from "../../controllers/handleRowsPageChange";
import countTotalData from "../../controllers/countTotalData";
import { withAuth } from "../../HOC/withAuth";
import TasksCard from "../../components/Cards/TasksCard";
import { Stack } from "@mui/material";
import AssignTasks from "../../components/FullScreenModal/AssignTasks";

const tableHeading = [
  "model",
  "title",
  "vendor",
  "category",
  "MRP",
  "SP",
  "assign to",
  "Entry status",
  "assign Date",
];
const dataHeading = [
  "model",
  "title",
  "vendor",
  "category",
  "MRP",
  "SP",
  "assignToName",
  "entryStatus",
];

function Tasks() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const params = { page, rowsPerPage };

  const fetchData = async (url) => {
    return await axios
      .get(url)
      .then((res) => res.data)
      .catch((err) => {
        throw new Error(err);
      });
  };
  const {
    data: products,
    error1,
    mutate: mutateData,
  } = useSWR(`${baseURL}/api/tasks`, fetchData);
  const {
    data: totalCount,
    error2,
    mutate: mutateCounts,
  } = useSWR(`${baseURL}/api/count-data`, (url) =>
    countTotalData(url, "tasks")
  );

  const handleChangePage = (event, newPage) => {
    setPage(parseInt(newPage));
    handleRowsPageChange(`${baseURL}/api/tasks`, params, mutateData);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
    handleRowsPageChange(`${baseURL}/api/tasks`, params, mutateData);
  };
  const handleStatusChange = async (event, _id) => {
    //only allow to tick check box if work in not ended
    let date = null;
    if (event.target.checked) {
      date = new Date();
    } else {
      date = "";
    }
    await axios
      .put(`${baseURL}/api/products/${_id}`, {
        entryStatus: event.target.checked,
        date: date,
      })
      .then(() => {
        mutateData();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  if (error1 || error2) {
    return <div>Failed to load products</div>;
  } else if (!products || totalCount === undefined) {
    if (totalCount < 1) {
      return <div>No tasks assigned today</div>;
    }
    return <div>Please wait loading...</div>;
  }

  let arr = [];
  products.filter((data, i, self) => {
    // self.findIndex(d => new Date(d.assignDate).toDateString() === new Date(data.assignDate).toDateString()) === i
    const indx = self.findIndex(
      (d) =>
        new Date(d.assignDate).toDateString() ===
          new Date(data.assignDate).toDateString() &&
        d.assignToDealAyoId === data.assignToDealAyoId
    );
    // console.log(indx ===i )
    if (indx === i) {
      arr.push([data]);
    } else {
      arr[i] = "";
      arr[indx].push(data);
    }
  });
  arr = arr.filter((item) => item.length);

  return (
    <div>
      <AssignTasks />
      <Stack direction="row" spacing={1.5}>
        {arr.map((ar) => (
          <TasksCard
            key={ar.assignDate}
            name={ar[0].assignToName}
            date={new Date(ar[0].assignDate).toDateString()}
            totalTasks={ar.length}
            completed={0}
            dealAyoId={ar.assignToDealAyoId}
          />
        ))}
      </Stack>
      {/* <CustomizedTables
                tableHeading={tableHeading}
                data={products.length > 0 ? products : []}
                dataHeading={dataHeading}
                page={page}
                rowsPerPage={rowsPerPage}
                handleChangePage={handleChangePage}
                handleChangeRowsPerPage={handleChangeRowsPerPage}
                totalCount={totalCount}
                onStatusChange={handleStatusChange}
                mutateData={mutateData}
                mutateCounts={mutateCounts}
            /> */}
    </div>
  );
}

export default withAuth(Tasks);
