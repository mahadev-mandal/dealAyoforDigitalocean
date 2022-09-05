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
import { Checkbox, FormControl, InputLabel, MenuItem, Select, TablePagination, Typography } from "@mui/material";
import { useState } from "react";
import axios from "axios";
import { baseURL } from "../../helpers/constants";
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
import countTotalData from "../../controllers/countTotalData";
import fetchData from "../../controllers/fetchData";
import handleRowsPageChange from "../../controllers/handleRowsPageChange";

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
}) {
  const router = useRouter();
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [errMsg, setErrMsg] = useState('');
  const [empFilter, setEmpFilter] = useState('');
  const [assignFilter, setAssignFilter] = useState('');
  const params = { page, rowsPerPage, empFilter, assignFilter };

  const {
    data,
    error: error1,
    mutate: mutateData,
  } = useSWR(`${baseURL}/api/${collectionName}`, (url) =>
    fetchData(url, params)
  );
  const {
    data: totalCount,
    error: error2,
    mutate: mutateCounts,
  } = useSWR(`${baseURL}/api/count-data`, (url) =>
    countTotalData(url, collectionName)
  );

  const handleChangePage = async (event, newPage) => {
    setPage(newPage);
    handleRowsPageChange(`${baseURL}/api/${collectionName}`, params, mutateData);
  };
  const handleChangeRowsPerPage = async (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
    handleRowsPageChange(`${baseURL}/api/${collectionName}`, params, mutateData);
  };

  const handleSelect = (event, row) => {
    setErrMsg('')
    if (event.target.checked) {
      setSelected([...selected, row._id]);
    } else {
      setSelected(selected.filter((id) => id !== row._id));
    }
  };
  const handleAllSelect = (event, data) => {
    setErrMsg('')
    if (event.target.checked) {
      setSelected([...new Set(selected.concat(data.map((p) => p._id)))]);
    } else {
      setSelected(
        selected.filter((id) => !data.map((p) => p._id).includes(id))
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
          mutateCounts();
          setSelected([]);
        });
    }
  };
  const handleAssignClick = async () => {
    await axios.post(`${baseURL}/api/tasks/assign`, { selected, assignDate, dealAyoId: assignToEmp.dealAyoId, name: assignToEmp.firstName, tasksId })
      .then(() => {
        setErrMsg('')
        mutateData();
        setSelected([])
      }).catch((err) => {
        setErrMsg(err.response.data)
        // console.log()
      })
  }
  const handleUnassignClick = async () => {
    if (selected.length > 0) {
      await axios
        .post(`${baseURL}/api/tasks`, { selected })
        .then(() => {
          setErrMsg('')
          mutateData();
          mutateCounts();
          setSelected([]);
        })
        .catch((err) => {
          setErrMsg(err.response.data)
        });
    }
  };
  const handleAssignFilterChange = async() => {
   
  }
  if (error1 || error2) {
    return <div>Error occured While fetching data</div>;
  } else if (!data || totalCount === undefined) {
    return <div>Please wait fetching data...</div>;
  }

  const details = data.filter((emp) => emp._id === selected[0])[0];

  const allSelectChecker = () => {
    if (selected.length > 0) {
      return data.map((p) => p._id).every((id) => selected.includes(id));
    } else {
      return false;
    }
  };
  return (
    <>
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
                <InputLabel id="demo-simple-select-label">Assign Date</InputLabel>
                <Select
                  size="small"
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  // value={assignFilter}
                  sx={{ width: 150, color: 'white' }}
                  label="Assign To"
                // onChange={e => setAssignFilter(e.target.value)}
                >
                  <MenuItem value="">None</MenuItem>
                  <MenuItem value="assigned" >Select Date</MenuItem>
                  <MenuItem value="unassigned" >Select Date</MenuItem>

                </Select>
              </FormControl>
              <FormControl size="small" fullWidth>
                <InputLabel id="demo-simple-select-label">Assigned</InputLabel>
                <Select
                  size="small"
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={assignFilter}
                  sx={{ width: 150, }}
                  label="Assigned"
                  onChange={handleAssignFilterChange}
                >
                  <MenuItem value="">None</MenuItem>
                  <MenuItem value="assigned" >Assigned</MenuItem>
                  <MenuItem value="unassigned" >Unassigned</MenuItem>

                </Select>
              </FormControl>
              <FormControl size="small" fullWidth>
                <InputLabel id="demo-simple-select-label">Assign To</InputLabel>
                <Select
                  size="small"
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={empFilter}
                  sx={{ width: 150, color: 'white' }}
                  label="Assign To"
                  onChange={e => setEmpFilter(e.target.value)}
                >
                  <MenuItem value="">None</MenuItem>
                  {employees.map((emp) => (
                    <MenuItem value={emp} key={emp.dealAyoId}>{emp.firstName}</MenuItem>
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
                    onChange={(e) => handleAllSelect(e, data)}
                  />
                </StyledTableCell>
                {tableHeading.map((heading) => (
                  <StyledTableCell key={heading}>{heading}</StyledTableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row, index) => (
                <StyledTableRow key={index}>
                  <StyledTableCell component="th" scope="row">
                    {page * rowsPerPage + (index + 1)}
                  </StyledTableCell>
                  <StyledTableCell component="th" scope="row">
                    <Checkbox
                      checked={selected.includes(row._id)}
                      onChange={(e) => handleSelect(e, row)}
                      sx={{ padding: 0 }}
                    />
                  </StyledTableCell>
                  {dataHeading.map((head) => (
                    <StyledTableCell key={head}>
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
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[20, 30, 50]}
          component="div"
          count={totalCount}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </>
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
};

export default CustomizedTables;
