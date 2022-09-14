import axios from "axios";
import Head from "next/head";
import React from "react";
import AssignTaskTable from "../../components/Table/AssignTaskTable";
import { baseURL } from "../../helpers/constants";
import { withAuth } from "../../HOC/withAuth";

const tableHeading = [
  "model",
  "title",
  "supplier",
  "category",
  "MRP",
  "SP",
  "Assign to",
  "entry status",
  "assign date",
  "remarks"
];
const dataHeading = [
  "model",
  "title",
  "supplier",
  "category",
  "MRP",
  "SP",
  "assignToName",
  "entryStatus",
];

function Products() {
  const handleStatusChange = async (event, _id) => {
    //only allow to tick check box if work in not ended

    let date = null;
    await axios
      .put(`${baseURL}/api/products/${_id}`, {
        entryStatus: event.target.checked,
        date: date,
      })
      .then(() => {
        // mutateProducts();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div>
      <Head>
        <title>Tasks By DealAyo</title>
      </Head>
      <AssignTaskTable
        tableHeading={tableHeading}
        dataHeading={dataHeading}
        collectionName="products"
        onStatusChange={handleStatusChange}
        defaultEmpFilter=""
        defaultAssignFilter=""
      />
    </div>
  );
}

export default withAuth(Products);
