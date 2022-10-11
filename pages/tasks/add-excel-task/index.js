import { Backdrop, Button, CircularProgress, Stack, TextField, Typography } from '@mui/material'
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { useRef, useState } from 'react';
import downloadExcel from '../../../controllers/downloadExcel';
import FilterByEmp from '../../../components/Filter/FilterProducts/FilterByEmp';
import useSWR from 'swr';
import { baseURL } from '../../../helpers/constants';
import fetchData from '../../../controllers/fetchData';
import FilterByStatus from '../../../components/Filter/FilterProducts/FilterByStatus';
import Remarks from '../../../components/ExtraCells/Dialogs/Remarks';
import ReturnDate from '../../../components/ExtraCells/ReturnDate';
import handleMutateData from '../../../controllers/handleMutateData';
import axios from 'axios';
import Head from 'next/head';
import SearchableTable from '../../../components/Table/SearchableTable';

const tableHeading = [
  "model",
  "title",
  "supplier",
  "brand",
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
  "brand",
  "category",
  "MRP",
  "SP",
  "assignToName",
  "",
  "",
];


function AddExcelTask() {
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [empFilter, setEmpfilter] = useState('');
  const [assignToEmp, setAssignToEmp] = useState('');
  const [statusFilter, setStatusFilter] = useState('unassigned');
  const [backdropOpen, setBackdropOpen] = useState(false);
  const date = new Date();
  const year = date.getFullYear();
  let month = date.getMonth() + 1;
  month = String("0" + month).slice(-2);
  const day = String("0" + date.getDate()).slice(-2);
  const [assignDate, setAssignDate] = useState(`${year}-${month}-${day}`)
  const [searchObj, setSearchObj] = useState({});
  const inputRef = useRef({});
  let params = { ...searchObj, page, rowsPerPage, empFilter, statusFilter };
  // const params = { page, rowsPerPage, empFilter: empFilter, statusFilter };

  const {
    data: products,
    error,
    mutate
  } = useSWR(`${baseURL}/api/products`, url => fetchData(url, params));
  const {
    data: employees,
    error1
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
  const handleEmpFilterChange = async (e) => {
    setBackdropOpen(true);
    setEmpfilter(e.target.value);
    await handleMutateData(`${baseURL}/api/products`, params,);
    mutate();
    setBackdropOpen(false);
  }
  const handleStatusFilterChange = async (event) => {
    if (event.target.value == 'unassigned') {
      setEmpfilter('')
    }
    setBackdropOpen(true);
    setStatusFilter(event.target.value);
    await handleMutateData(`${baseURL}/api/products`, params);
    mutate()
    setBackdropOpen(false);
  }

  const handleAssignClick = async () => {
    setBackdropOpen(true)
    await axios.post(`${baseURL}/api/tasks/assign`, {
      selected,
      assignDate,
      assignToEmp
    }).then(() => {
      mutate();
      setSelected([])
      setBackdropOpen(false)
    }).catch((err) => {
      console.log(err);
    })
  }

  const handleUnassignClick = async () => {
    setBackdropOpen(true);
    if (selected.length > 0) {
      await axios
        .post(`${baseURL}/api/tasks`, { selected })
        .then(() => {
          setSelected([]);
          mutate();
          setBackdropOpen(false);
        })
        .catch((err) => {
          console.log(err)
        });
    }
  };

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
    setEmpfilter('');
    setStatusFilter('unassigned');
    await handleMutateData(`${baseURL}/api/products`, { params });
    mutate();
    Object.keys(inputRef.current).forEach((da) => {
      inputRef.current[da].value = null;
    })
    setBackdropOpen(false)
  }

  if (error || error1) {
    return <div>Something is wrong</div>
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
          <Typography variant='h6'>loading...</Typography>
        </Stack>
      </Backdrop>
      <Stack spacing={1} sx={{ mb: 0.5 }}>
        <Stack direction="row" spacing={5} >
          <TextField
            type="date"
            variant="standard"
            sx={{ width: 125 }}
            value={assignDate}
            onChange={e => setAssignDate(e.target.value)}
          />
          <FilterByEmp
            employees={employees.data}
            toEmp={assignToEmp}
            onChange={e => setAssignToEmp(e.target.value)}
            width="150px"
          />
        </Stack>
        <Stack direction="row" justifyContent="space-between">
          <Stack direction="row" spacing={1}>
            <Button
              size="small"
              variant="contained"
              color="secondary"
              onClick={() => downloadExcel(selected)}
              disabled={selected.length >= 1 ? false : true}
            >
              <FileDownloadIcon /> Excel file {selected.length}
            </Button>
            <Button
              size="small"
              variant="contained"
              color="warning"
              onClick={handleUnassignClick}
              disabled={selected.length >= 1 ? false : true}
            >
              <RemoveCircleOutlineIcon /> Unassign {selected.length}
            </Button>
            <Button
              size="small"
              variant="contained"
              color="warning"
              onClick={handleAssignClick}
              disabled={selected.length >= 1 ? false : true}
            >
              <RemoveCircleOutlineIcon /> Assign {selected.length}
            </Button>
          </Stack>
          <Stack direction="row" spacing={1}>
            <FilterByStatus
              statusFilter={statusFilter}
              onChange={handleStatusFilterChange}
            />
            <FilterByEmp
              employees={employees.data}
              toEmp={empFilter}
              onChange={handleEmpFilterChange}
              disabled={statusFilter == 'unassigned'}
              width="150px"
            />
            <Button onClick={handleResetFilter}>
              Reset
            </Button>
          </Stack>
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
  )
}

export default AddExcelTask
