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
import { TablePagination } from '@mui/material';


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


export default function SimpleTable({ tableHeading, data, dataHeading, page, rowsPerPage, totalCount, handleChangePage, handleChangeRowsPerPage }) {
    return (
        <>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 700 }} aria-label="customized table" size="small">
                    <TableHead>
                        <TableRow>
                            <StyledTableCell>S.N</StyledTableCell>
                            {tableHeading.map((heading) => (
                                <StyledTableCell key={heading}>{heading}</StyledTableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.map((row, index) => (
                            <StyledTableRow key={row._id}>
                                <StyledTableCell component="th" scope="row">
                                    {index}
                                </StyledTableCell>
                                {dataHeading.map((head) => (
                                    <StyledTableCell key={head}>
                                        {head != 'additionalDetails' ? row[head] : JSON.stringify(row[head])}
                                    </StyledTableCell>

                                ))}
                            </StyledTableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer >
            <TablePagination
                rowsPerPageOptions={[20, 30, 50]}
                component="div"
                count={totalCount}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </>
    );
}

SimpleTable.propTypes = {
    tableHeading: PropTypes.array,
    data: PropTypes.array,
    dataHeading: PropTypes.array,
    page: PropTypes.number,
    rowsPerPage: PropTypes.number,
    totalCount: PropTypes.number,
    handleChangePage: PropTypes.func,
    handleChangeRowsPerPage: PropTypes.func,
}

