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
import NepaliDate from 'nepali-date-converter'
import returnAttendanceStyle from '../../controllers/returnAttendanceStyle';


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

const StyledTableRow = styled(TableRow)(() => ({
    '&:nth-of-type(odd)': {
        // backgroundColor: theme.palette.action.hover,

    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));

// const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function AttendanceTable({
    tableHeading,
    data,
    dataHeading,
    page,
    rowsPerPage,
    handleChangePage,
    handleChangeRowsPerPage,
    totalCount,
    ExtraCells
}) {
    const returnComp = (Comp, row, head) => <Comp row={row} head={head} />
    function sortByDateFunct(a, b) {
        return new Date(a.date) - new Date(b.date);
    }
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
                        {data.sort(sortByDateFunct).map((row, index1) => (
                            row.employees.map((item) => (
                                <StyledTableRow
                                    title={row.details}
                                    sx={{
                                        ...returnAttendanceStyle(row),
                                        
                                    }}
                                    key={item.dealAyoId}
                                >
                                    <StyledTableCell component="th" scope="row">
                                        {index1 + 1}
                                    </StyledTableCell>
                                    <StyledTableCell component="th" scope="row">
                                        {new NepaliDate(new Date(row.date)).format('ddd, DD MMMM YYYY')}
                                    </StyledTableCell>
                                    <StyledTableCell component="th" scope="row">
                                        {new Date(row.date).toLocaleDateString()}
                                    </StyledTableCell>
                                    {dataHeading.map((head, i) => (
                                        !(head == '') ?
                                            <StyledTableCell
                                                key={tableHeading[i]}
                                            >
                                                {item[head]}
                                            </StyledTableCell> :
                                            <StyledTableCell key={tableHeading[i + 2]}>
                                                {returnComp(ExtraCells[tableHeading[i + 2]],
                                                    { ...item, date: row.date, type: row.type }, tableHeading[i]
                                                )}
                                            </StyledTableCell>
                                    ))}
                                </StyledTableRow>
                            ))
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
        </>
    );
}

AttendanceTable.propTypes = {
    tableHeading: PropTypes.array,
    data: PropTypes.array,
    dataHeading: PropTypes.array,
    page: PropTypes.number,
    rowsPerPage: PropTypes.number,
    totalCount: PropTypes.number,
    handleChangePage: PropTypes.func,
    handleChangeRowsPerPage: PropTypes.func,
    ExtraCells: PropTypes.object,
}

export default AttendanceTable;