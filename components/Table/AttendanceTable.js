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

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function AttendanceTable({ tableHeading, data, dataHeading, }) {

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
                        {data.map((attendances, index1) => (
                            attendances.employees.map((attendance) => (
                                <StyledTableRow key={attendance.dealAyoId}>
                                    <StyledTableCell component="th" scope="row">
                                        {index1}
                                    </StyledTableCell>
                                    <StyledTableCell component="th" scope="row">
                                        {new Date(attendances.date).toLocaleDateString()}
                                    </StyledTableCell>
                                    <StyledTableCell component="th" scope="row">
                                        {/* new Date(attendances.date).toLocaleDateString('en-us', { weekday: 'long' }) */}
                                        {days[new Date(attendances.date).getDay()]}
                                    </StyledTableCell>
                                    {dataHeading.map((head) => (
                                        <StyledTableCell key={head}>
                                            {attendance[head]}
                                        </StyledTableCell>
                                    ))}
                                </StyledTableRow>
                            ))
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
}

AttendanceTable.propTypes = {
    tableHeading: PropTypes.array,
    data: PropTypes.array,
    dataHeading: PropTypes.array,
    onEntryChange: PropTypes.array,
    onExitChange: PropTypes.array,
}

