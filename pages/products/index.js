import Head from "next/head";
import React from "react";
import { useState } from "react";
import useSWR from "swr";
import Remarks from '../../components/ExtraCells/Dialogs/Remarks';
import SearchableTable from "../../components/Table/SearchableTable";
import fetchData from "../../controllers/fetchData";
import handleMutateData from "../../controllers/handleMutateData";
import { baseURL } from "../../helpers/constants";
import { withAuth } from "../../HOC/withAuth";
import { Backdrop, Button, CircularProgress, Stack, Typography } from "@mui/material";
import FullScreenDialog from "../../components/Dialogs/FullScreenDialogs/AddProducts";
import AreYouSureModal from "../../components/Dialogs/AreYouSure";
import axios from "axios";
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import downloadExcel from "../../controllers/downloadExcel";
import FilterByEmp from "../../components/Filter/FilterProducts/FilterByEmp";
import FilterByStatus from "../../components/Filter/FilterProducts/FilterByStatus";
import ReturnDate from "../../components/ExtraCells/ReturnDate";

const tableHeading = [
  "model",
  "title",
  "supplier",
  "category",
  "MRP",
  "SP",
  "Assign to",
  "assignDate",
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
  "",
  ""
];

function Products() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [selected, setSelected] = useState([]);
  const [toEmp, setToEmp] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [backdropOpen, setBackdropOpen] = useState(false);
  const [searchObj, setSearchObj] = useState({});
  const inputRef = React.useRef({});
  let params = { ...searchObj, page, rowsPerPage, empFilter: toEmp, statusFilter };

  const {
    data: products,
    error,
    mutate
  } = useSWR(`${baseURL}/api/products`, url => fetchData(url, params));
  const {
    data: employees,
    error: error1,
  } = useSWR(`${baseURL}/api/employees`, fetchData);

  const handleSelectChange = (event, row) => {
    if (event.target.checked) {
      setSelected([...selected, row]);
    } else {
      setSelected(selected.filter((p) => p._id !== row._id));
    }
  }
  const handleAllSelectChange = (event) => {
    if (event.target.checked) {
      setSelected([...new Set(selected.concat(products.data.map((p) => p)))]);
    } else {
      setSelected(
        selected.filter((s) => !products.data.map((p) => p._id).includes(s._id))
      );
    }
  }

  const handleChangePage = async (event, newPage) => {
    setBackdropOpen(true);
    setPage(parseInt(newPage));
    await handleMutateData(`${baseURL}/api/products`, params);
    mutate();
    setBackdropOpen(false);
  }
  const handleChangeRowsPerPage = async (event) => {
    setBackdropOpen(true);
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(parseInt(0))
    await handleMutateData(`${baseURL}/api/products`, params);
    mutate();
    setBackdropOpen(false);
  }
  const handleClickYes = async (type) => {
    if (type === "delete") {
      return await axios.delete(`${baseURL}/api/products`, {
        data: { _ids: selected },
      })
        .then(() => {
          mutate();
          return true
        });
    }
  };
  const handleEmpChange = async (e) => {
    setBackdropOpen(true);
    setToEmp(e.target.value);
    await handleMutateData(`${baseURL}/api/products`, params,);
    mutate();
    setBackdropOpen(false);
  }
  const handleStatusFilterChange = async (event) => {
    setBackdropOpen(true);
    if (event.target.value == 'unassigned') {
      setToEmp('')
    }
    setStatusFilter(event.target.value);
    await handleMutateData(`${baseURL}/api/products`, params);
    mutate()
    setBackdropOpen(false);
  }

  const handleKeyPress = async (e) => {
    if (e.key == 'Enter') {
      setBackdropOpen(true);
      e.preventDefault()
      let obj = {};
      Object.keys(inputRef.current).forEach((da) => {
        obj[da] = inputRef.current[da].value
      })
      setSearchObj(obj);
      await handleMutateData(`${baseURL}/api/products`, { params })
      mutate();
      setBackdropOpen(false);

    }
  }
  const handleResetFilter = async () => {
    setBackdropOpen(true)
    setPage(0);
    setSearchObj({});
    setToEmp('');
    setStatusFilter('');
    await handleMutateData(`${baseURL}/api/products`, { params });
    mutate();
    Object.keys(inputRef.current).forEach((da) => {
      inputRef.current[da].value = null;
    })
    setBackdropOpen(false)
  }

  if (error || error1) {
    return <div>Error occured while fetching products</div>
  } else if (!products || !employees) {
    return <div>Please wait loading...</div>
  }

  return (
    <div>
      <Head>
        <title>Tasks By DealAyo</title>
      </Head>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={backdropOpen}
      >
        <Stack alignItems="center" justifyContent="center" sx={{ mt: 3 }}>
          <CircularProgress color="secondary" />
          <Typography variant='h6'>loding...</Typography>
        </Stack>
      </Backdrop>
      <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
        <Stack direction="row" spacing={1}>
          <>
            <FullScreenDialog collName="products" />
            <AreYouSureModal
              title={`Are you sure want to delete ${selected.length} products`}
              selected={selected}
              handleClickYes={() => handleClickYes("delete")}
            />

          </>
          <Button
            size="small"
            variant="contained"
            color="secondary"
            onClick={() => downloadExcel(selected)}
            disabled={selected.length >= 1 ? false : true}
          >
            <FileDownloadIcon /> Excel file {selected.length}
          </Button>
        </Stack>
        <Stack direction="row" spacing={1} alignItems="center">
          <Typography variant="body1" component="span">SortBy:</Typography>
          <FilterByStatus
            statusFilter={statusFilter}
            onChange={handleStatusFilterChange}
          />
          <FilterByEmp
            employees={employees.data}
            toEmp={toEmp}
            onChange={handleEmpChange}
            disabled={statusFilter == 'unassigned'}
            width="150px"
          />
          <Button onClick={handleResetFilter}>Reset</Button>
        </Stack>
      </Stack>

      <SearchableTable
        tableHeading={tableHeading}
        dataHeading={dataHeading}
        data={products.data}
        totalCount={products.totalCount}
        page={page}
        rowsPerPage={rowsPerPage}
        handleChangePage={handleChangePage}
        handleChangeRowsPerPage={handleChangeRowsPerPage}
        type="selectable"
        selected={selected}
        onSelectChange={handleSelectChange}
        onAllSelectChange={handleAllSelectChange}
        onKeyPress={handleKeyPress}
        ExtraCells={{ remarks: Remarks, assignDate: ReturnDate }}
        inputRef={inputRef}
      />
    </div>
  );
}

export default withAuth(Products);
