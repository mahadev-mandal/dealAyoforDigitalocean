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
import { Checkbox } from '@mui/material';
import axios from 'axios';
import { baseURL } from '../../helpers/constants';
import { mutate } from 'swr';


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

export default function TodayTable({ tableHeading, data, dataHeading, }) {

    const handleEntryChange = async (e, dealAyoId, firstName, type) => {
        var entryTime;
        var exitTime;
        if (type === 'entryTime') {
            if (e.target.checked) {
                entryTime = new Date();
            } else {
                entryTime = null
            }
        }
        if (type === 'exitTime') {
            if (e.target.checked) {
                exitTime = new Date();
            } else {
                exitTime = null;
            }
        }
        console.log(Number('10:00'))
        const body = {
            dealAyoId: dealAyoId,
            date: new Date(),
            entryTime: entryTime,
            exitTime: exitTime,
            name: firstName
        }
        await axios.put(`${baseURL}/api/attendance`, body)
            .then(() => {
                mutate(`${baseURL}/api/attendance`)
            })
    }

    const returnTime = (date) => {
        if (date) {
            return new Date(date).toLocaleTimeString();
        } else {
            return ''
        }
    }

    return (
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
                    {data.map((attendance, index) => (
                        <StyledTableRow key={index}>
                            <StyledTableCell component="th" scope="row">
                                {index}
                            </StyledTableCell>
                            {dataHeading.map((head) => (
                                <StyledTableCell key={head} >
                                    {
                                        (head === 'entryTime' || head === 'exitTime') ?
                                            <div>
                                                <Checkbox
                                                    checked={attendance[head] ? true : false}
                                                    onChange={e => handleEntryChange(e, attendance.dealAyoId, attendance.firstName, head)}
                                                    sx={{ padding: 0, }}
                                                />
                                                {returnTime(attendance[head])}
                                            </div> : head === 'workingHrs' ? `${attendance.startTime} - ${attendance.endTime}` : attendance[head]
                                    }
                                </StyledTableCell>
                            ))}
                        </StyledTableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

TodayTable.propTypes = {
    tableHeading: PropTypes.array,
    data: PropTypes.array,
    dataHeading: PropTypes.array,
    onEntryChange: PropTypes.array,
    onExitChange: PropTypes.array,
}

