// import axios from "axios";
import React from "react";
import useSWR from "swr";
import { baseURL, containerMargin } from "../../helpers/constants";
import { withAuth } from "../../HOC/withAuth";
import TasksCard from "../../components/Cards/TasksCard";
import { Box, Stack } from "@mui/material";
import AssignTasks from "../../components/FullScreenModal/AssignTasks";
import fetchData from "../../controllers/fetchData";

function Tasks() {
    const {
        data: products,
        error1,

    } = useSWR(`${baseURL}/api/tasks`, url => fetchData(url));

    // const handleStatusChange = async (event, _id) => {
    //     //only allow to tick check box if work in not ended
    //     let date = null;
    //     if (event.target.checked) {
    //         date = new Date();
    //     } else {
    //         date = "";
    //     }
    //     await axios
    //         .put(`${baseURL}/api/products/${_id}`, {
    //             entryStatus: event.target.checked,
    //             date: date,
    //         })
    //         .then(() => {
    //             mutateData();
    //         })
    //         .catch((err) => {
    //             console.log(err);
    //         });
    // };

    if (error1) {
        return <div>Failed to load products</div>;
    } else if (!products) {
        return <div>Please wait loading...</div>;
    }

    let arr = [];
    products.filter((data, i, self) => {
        // self.findIndex(d => new Date(d.assignDate).toDateString() === new Date(data.assignDate).toDateString()) === i
        const indx = self.findIndex(
            (d) =>
                new Date(d.assignDate).toDateString() ===
                new Date(data.assignDate).toDateString() &&
                d.tasksId === data.tasksId
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
    // console.log(arr,products)
    return (
        <Box sx={{ m: containerMargin }}>
            <AssignTasks />
            <Stack direction="row" spacing={1.5}>
                {arr.map((ar,) => (
                    <TasksCard
                        key={ar[0].model}
                        tasks={ar}
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
        </Box>
    );
}

export default withAuth(Tasks);
