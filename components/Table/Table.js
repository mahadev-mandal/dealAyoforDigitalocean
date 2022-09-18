import * as React from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import PropTypes from "prop-types";
import { Backdrop, Box, Checkbox, CircularProgress, FormControl, InputLabel, MenuItem, Select, TablePagination, Typography } from "@mui/material";
import { useState } from "react";
import axios from "axios";
import { baseURL, containerMargin } from "../../helpers/constants";
import FullScreenDialog from "../FullScreenDialog/FullScreenDialog";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import BlockIcon from "@mui/icons-material/Block";
import { Button, Stack } from "@mui/material";
import AddEmployee from "../EmployeeModal/AddEmployee";
import AddCategory from "../CategoryModal/AddCategory";
import { useRouter } from "next/router";
import EditEmployee from "../EmployeeModal/EditEmployee";
import EditCategory from "../CategoryModal/EditCategory";
import AreYouSureModal from "../SureModal";
import useSWR from "swr";
import fetchData from "../../controllers/fetchData";
import handleRowsPageChange from "../../controllers/handleRowsPageChange";
import { returnStyle } from "../../controllers/returnStyle";
import Remarks from "../Remarks/Remarks";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
    textTransform: "uppercase",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    maxWidth: "200px",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

function CustomizedTables({
  tableHeading,
  dataHeading,
  onStatusChange,
  collectionName,
  assignDate,
  assignToEmp,
  tasksId,
  employees,
  defaultEmpFilter,
  defaultAssignFilter

}) {
  const router = useRouter();
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [errMsg, setErrMsg] = useState('');
  const [empFilter, setEmpFilter] = useState(defaultEmpFilter);
  const [assignFilter, setAssignFilter] = useState(defaultAssignFilter);
  const params = { page, rowsPerPage, empFilter, assignFilter };
  const [open, setOpen] = useState(false);
  const { searchText } = router.query;

  const {
    data,
    error: error1,
    mutate: mutateData,
  } = useSWR(`${baseURL}/api/${collectionName}`, (url) =>
    fetchData(url, params)
  );

  const handleChangePage = async (event, newPage) => {
    setOpen(true);
    setPage(newPage);
    handleRowsPageChange(`${baseURL}/api/${collectionName}`, params, mutateData)
      .then(() => setOpen(false));
  };
  const handleChangeRowsPerPage = async (event) => {
    setOpen(true)
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
    handleRowsPageChange(`${baseURL}/api/${collectionName}`, params, mutateData)
      .then(() => setOpen(false));
  };

  const handleSelect = (event, row) => {
    setErrMsg('')
    if (event.target.checked) {
      setSelected([...selected, row]);
    } else {
      setSelected(selected.filter((p) => p._id !== row._id));
    }
  };
  const handleAllSelect = (event, data) => {
    setErrMsg('')
    if (event.target.checked) {
      setSelected([...new Set(selected.concat(data.map((p) => p)))]);
    } else {
      setSelected(
        selected.filter((s) => !data.map((p) => p._id).includes(s._id))
      );
    }
  };
  const returnTime = (date) => {
    if (date) {
      return new Date(date).toLocaleTimeString();
    } else {
      return "";
    }
  };

  const handleClickYes = async (type) => {
    if (type === "delete") {
      axios
        .delete(`${baseURL}/api/${collectionName}`, {
          data: { _ids: selected },
        })
        .then(() => {
          setErrMsg('')
          mutateData();
          setSelected([]);
        });
    }
  };
  const handleAssignClick = async () => {
    setOpen(true)
    await axios.post(`${baseURL}/api/tasks/assign`, {
      selected,
      assignDate,
      assignToDealAyoId: assignToEmp.dealAyoId,
      assignToName: assignToEmp.firstName,
      tasksId
    }).then(() => {
      setErrMsg('')
      mutateData();
      setSelected([])
      setOpen(false)
    }).catch((err) => {
      setErrMsg(err.response.data)
      setOpen(false)
      // console.log()
    })
  }

  const handleUnassignClick = async () => {
    setOpen(true);
    if (selected.length > 0) {
      await axios
        .post(`${baseURL}/api/tasks`, { selected })
        .then(() => {
          setErrMsg('')
          mutateData();
          setSelected([]);
          setOpen(false)
        })
        .catch((err) => {
          setErrMsg(err.response.data)
          setOpen(false)
        });
    }
  };
  const handleFilterChange = async (event, type) => {
    setOpen(true)
    if (type == 'assign') {
      setAssignFilter(event.target.value);
      if (event.target.value == 'unassigned') {
        setEmpFilter('')
      }
    } else if (type == 'employee') {
      setEmpFilter(event.target.value);
    }
    await axios.get(`${baseURL}/api/${collectionName}`, params)
      .then(() => { mutateData(); setOpen(false) })
  }
  const compareText = (row, head) => {
    if (typeof (row[head]) == 'string' && searchText) {
      return row[head].toLowerCase() == searchText.toLowerCase()
    }
  }

  if (error1) {
    return <div>Error occured While fetching data</div>;
  } else if (!data) {
    return <div>Please wait fetching data...</div>;
  }

  const details = selected;

  const allSelectChecker = () => {
    if (selected.length > 0) {
      return data.data.map(p => p._id).every((pid) => selected.map(s => s._id).includes(pid));
    } else {
      return false;
    }
  };
  return (
    <Box sx={{ m: containerMargin }}>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={open}
      // onClick={handleClose}
      >
        <Stack alignItems="center" justifyContent="center" sx={{ mt: 3 }}>
          <CircularProgress color="secondary" />
          <Typography variant='h6'>Loading...</Typography>
        </Stack>
      </Backdrop>
      <Typography variant="body1" textAlign="center" color="red">{errMsg}</Typography >
      <Stack spacing={1} direction="row" sx={{ mb: 0.5 }}>
        {!router.pathname.startsWith("/tasks") ? (
          <Button
            size="small"
            variant="contained"
            color="warning"
            disabled={selected.length >= 1 ? false : true}
          >
            <BlockIcon />
            Disable {selected.length}
          </Button>
        ) : (
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ width: '100%', mt: 1 }}>
            <Stack direction="row" spacing={1}>
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
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography variant="h6" component="span">SortBy:</Typography>
              <FormControl size="small" fullWidth>
                <InputLabel id="demo-simple-select-label">Assign status</InputLabel>
                <Select
                  size="small"
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  defaultValue='unassigned'
                  sx={{ width: 150, }}
                  label="Assign status"
                  onChange={e => handleFilterChange(e, 'assign')}
                >
                  <MenuItem value="">None</MenuItem>
                  <MenuItem value="assigned" >Assigned</MenuItem>
                  <MenuItem value="unassigned" >Unassigned</MenuItem>

                </Select>
              </FormControl>
              <FormControl size="small" fullWidth>
                <InputLabel id="demo-simple-select-label">Date Range</InputLabel>
                <Select
                  size="small"
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  defaultValue=''
                  sx={{ width: 150, }}
                  label="Date range"
                // onChange={e => setAssignFilter(e.target.value)}
                >
                  <MenuItem value="">None</MenuItem>
                  <MenuItem value="assigned" >Select Date</MenuItem>
                  <MenuItem value="unassigned" >Select Date</MenuItem>

                </Select>
              </FormControl>
              <FormControl size="small" fullWidth>
                <InputLabel id="demo-simple-select-label">Assign To</InputLabel>
                <Select
                  size="small"
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  disabled={assignFilter === 'unassigned'}
                  value={empFilter}
                  sx={{ width: 150, }}
                  label="Assign To"
                  onChange={e => handleFilterChange(e, 'employee')}
                >
                  <MenuItem value="">None</MenuItem>
                  {employees.data.map((emp) => (
                    <MenuItem value={emp.dealAyoId} key={emp.dealAyoId}>{emp.firstName}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>
          </Stack>
        )}

        {!router.pathname.startsWith("/tasks") ? (
          collectionName === "employees" ? (
            <>
              <AreYouSureModal
                title={`Are you sure want to delete ${selected.length} employees`}
                selected={selected}
                handleClickYes={() => handleClickYes("delete")}
              />
              <EditEmployee
                empDetails={selected.length === 1 ? details : {}}
                disabled={selected.length != 1}
              />
              <AddEmployee />
            </>
          ) : collectionName === "categories" ? (
            <>
              <AreYouSureModal
                title={`Are you sure want to delete ${selected.length} categories`}
                selected={selected}
                handleClickYes={() => handleClickYes("delete")}
              />
              <EditCategory
                categoryDetails={selected.length === 1 ? details : {}}
                disabled={selected.length != 1}
              />
              <AddCategory />
            </>
          ) : (
            <>
              <AreYouSureModal
                title={`Are you sure want to delete ${selected.length} products`}
                selected={selected}
                handleClickYes={() => handleClickYes("delete")}
              />
              <FullScreenDialog />
            </>
          )
        ) : null}
      </Stack>
      <Paper>
        <TableContainer component={Paper}>
          <Table
            sx={{ minWidth: 700 }}
            aria-label="customized table"
            size="small"
          >
            <TableHead>
              <TableRow>
                <StyledTableCell>S.N</StyledTableCell>
                <StyledTableCell>
                  <Checkbox
                    sx={{ color: "white", padding: 0 }}
                    checked={allSelectChecker()}
                    onChange={(e) => handleAllSelect(e, data.data)}
                  />
                </StyledTableCell>
                {tableHeading.map((heading) => (
                  <StyledTableCell key={heading}>{heading}</StyledTableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {data.data.map((row, index) => (
                <StyledTableRow key={index} style={returnStyle(row)}>
                  <StyledTableCell component="th" scope="row">
                    {page * rowsPerPage + (index + 1)}
                  </StyledTableCell>
                  <StyledTableCell component="th" scope="row">
                    <Checkbox
                      checked={selected.map(p => p._id).includes(row._id)}
                      onChange={(e) => handleSelect(e, row)}
                      sx={{ padding: 0 }}
                    />
                  </StyledTableCell>
                  {dataHeading.map((head) => (
                    <StyledTableCell
                      key={head}
                      sx={{
                        textTransform: head === 'title' ? 'capitalize' : '',
                        background: compareText(row, head) ? '#FFFF00' : '',
                      }}
                    >
                      {typeof row[head] === "boolean" ? (
                        <Checkbox
                          checked={row[head]}
                          onChange={(e) => onStatusChange(e, row._id)}
                          sx={{ padding: 0 }}
                        />
                      ) : head === "entryDate" ? (
                        returnTime(row[head])
                      ) : (
                        row[head]
                      )}
                    </StyledTableCell>
                  ))}
                  <StyledTableCell>
                    {row.assignDate && new Date(row.assignDate).toDateString()}
                  </StyledTableCell>
                  <StyledTableCell sx={{ textAlign: 'center' }}>
                    <Remarks
                      title={row.title}
                      _id={row._id}
                      remarks={row.remarks}
                    />
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[20, 30, 50]}
          component="div"
          count={data.totalCount}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
}

CustomizedTables.propTypes = {
  tableHeading: PropTypes.array,
  dataHeading: PropTypes.array,
  onStatusChange: PropTypes.func,
  collectionName: PropTypes.string,
  assignToEmp: PropTypes.object,
  assignDate: PropTypes.string,
  tasksId: PropTypes.number,
  employees: PropTypes.array,
  defaultEmpFilter: PropTypes.string,
  defaultAssignFilter: PropTypes.string,
};

export default CustomizedTables;
