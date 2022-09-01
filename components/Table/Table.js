import * as React from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import PropTypes from 'prop-types'
import { Checkbox, TablePagination } from '@mui/material';
import { useState } from 'react';
import axios from 'axios';
import { baseURL } from '../../helpers/constants';
import FullScreenDialog from '../FullScreenDialog/FullScreenDialog';
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import BlockIcon from '@mui/icons-material/Block';
import { Button, Stack } from '@mui/material';
import AddEmployee from '../EmployeeModal/AddEmployee';
import AddCategory from '../AddCategoryModal/AddCategoryModal';
import { useRouter } from 'next/router';
import EditEmployee from '../EmployeeModal/EditEmployee';


const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
        textTransform: 'uppercase',
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
        maxWidth: '200px',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,

    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));

function CustomizedTables({ tableHeading, data, dataHeading, onStatusChange, page, rowsPerPage, handleChangePage, handleChangeRowsPerPage, totalCount, collectionName, mutateData, mutateCounts }) {
    const router = useRouter();
    const [selected, setSelected] = useState([]);

    const handleSelect = (event, row) => {
        if (event.target.checked) {
            setSelected([...selected, row._id])
        } else {
            setSelected(selected.filter(id => id !== row._id))
        }
    }
    const handleAllSelect = (event, data) => {
        if (event.target.checked) {
            setSelected(data.map((p) => p._id))
        } else {
            setSelected([])
        }
    }
    const returnTime = (date) => {
        if (date) {
            return new Date(date).toLocaleTimeString();
        } else {
            return ''
        }
    }
    const a = data.filter(emp => emp._id === selected[0])[0]

    const handleDelete = async () => {
        axios.delete(`${baseURL}/api/${collectionName}`, { data: { _ids: selected } })
            .then(() => {
                mutateData();
                mutateCounts()
                setSelected([])
            })
    }
    const handleEdit = async () => {

    }

    return (
        <>
            <Stack spacing={1} direction="row" sx={{ mb: 0.5 }}>
                <Button
                    size="small"
                    variant="contained"
                    color="warning"
                    disabled={selected.length >= 1 ? false : true}
                >
                    <BlockIcon />Disable {selected.length}
                </Button>
                <Button
                    variant="contained"
                    size="small"
                    color="error"
                    disabled={selected.length >= 1 ? false : true}
                    onClick={handleDelete}
                >
                    <DeleteForeverIcon />Delete {selected.length}
                </Button>
                <EditEmployee
                    empDetails={selected.length === 1 ? a : {}}
                    disabled={selected.length != 1}
                />
                <Button
                    variant="contained"
                    size="small"
                    color="primary"
                    disabled={selected.length === 1 ? false : true}
                    onClick={handleEdit}
                >
                    <EditIcon />Edit
                </Button>
                {!router.pathname.startsWith('/tasks') ?
                    collectionName === 'employees' ?
                        <AddEmployee />
                        : collectionName === 'categories' ? <AddCategory /> : <FullScreenDialog /> : null

                }
            </Stack>
            <Paper>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 700 }} aria-label="customized table" size="small">
                        <TableHead>
                            <TableRow>
                                <StyledTableCell>S.N</StyledTableCell>
                                <StyledTableCell>
                                    <Checkbox
                                        sx={{ color: 'white', padding: 0 }}
                                        onChange={e => handleAllSelect(e, data)}
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
                                        {(page * rowsPerPage) + (index + 1)}
                                    </StyledTableCell>
                                    <StyledTableCell component="th" scope="row">
                                        <Checkbox
                                            checked={selected.includes(row._id)}
                                            onChange={(e) => handleSelect(e, row)}
                                            sx={{ padding: 0, }}
                                        />
                                    </StyledTableCell>
                                    {dataHeading.map((head) => (
                                        <StyledTableCell key={head} >
                                            {
                                                typeof (row[head]) === 'boolean' ?
                                                    <Checkbox
                                                        checked={row[head]}
                                                        onChange={e => onStatusChange(e, row._id)}
                                                        sx={{ padding: 0, }}
                                                    /> : head === 'entryDate' ? returnTime(row[head]) : row[head]
                                            }
                                        </StyledTableCell>
                                    ))}
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
    data: PropTypes.array,
    dataHeading: PropTypes.array,
    onStatusChange: PropTypes.func,
    page: PropTypes.number,
    totalCount: PropTypes.number,
    rowsPerPage: PropTypes.number,
    handleChangePage: PropTypes.func,
    handleChangeRowsPerPage: PropTypes.func,
    collectionName: PropTypes.string,
    mutateData: PropTypes.func,
    mutateCounts: PropTypes.func,
}

export default CustomizedTables;