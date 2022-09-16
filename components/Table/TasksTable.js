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
import copyToClipboard from '../../controllers/copyToClipboard';
import AdditionalDetailsModal from '../AdditionalDetailsModal/AdditionalDetailsModal';
import Remarks from '../Remarks/Remarks';
import { returnStyle } from '../../controllers/returnStyle';

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
        userSelect: 'all'
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

function TasksTable({
    tableHeading,
    data,
    dataHeading,
    onStatusChange,
    page,
    rowsPerPage,
    handleChangePage,
    disableClick,
    handleChangeRowsPerPage,
    totalCount,
}) {
    const returnTime = (date) => {
        if (date) {
            return new Date(date).toLocaleTimeString();
        } else {
            return ''
        }
    }

    return (
        <>
            <Paper>
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
                                <StyledTableRow key={index} style={returnStyle(row)}>
                                    <StyledTableCell component="th" scope="row">
                                        {(page * rowsPerPage) + (index + 1)}
                                    </StyledTableCell>
                                    {dataHeading.map((head) => (
                                        <StyledTableCell
                                            key={head}
                                            onClick={(e) => copyToClipboard(e.target.innerText)}
                                            sx={{
                                                transformation: 'lowercase, "a-z" to "A-Z" single',
                                                scope: 'initial',

                                            }}
                                        >
                                            {
                                                typeof (row[head]) === 'boolean' ?
                                                    <Checkbox
                                                        checked={row[head]}
                                                        disabled={disableClick}
                                                        onChange={e => onStatusChange(e, row._id, head)}
                                                        sx={{ padding: 0, }}
                                                    /> : head === 'entryDate' ? returnTime(row[head]) : row[head]
                                            }
                                        </StyledTableCell>
                                    ))}
                                    <StyledTableCell sx={{ textAlign: 'center' }}>
                                        {Object.keys(row.additionalDetails ? row.additionalDetails : {}).length >= 1 ?
                                            <AdditionalDetailsModal
                                                title={row.title}
                                                additionalDetails={row.additionalDetails ? row.additionalDetails : {}}
                                            /> : null
                                        }
                                    </StyledTableCell>
                                    <StyledTableCell sx={{ textAlign: 'center' }}>
                                        <Remarks
                                            title={row.title}
                                            _id={row._id}
                                            remarks={row.remarks}
                                        />
                                    </StyledTableCell>
                                    {/* <StyledTableCell>
                                        <input type="text" style={{ width: '100%' }} value={sku} onChange={e => handleSkuChange(e)} />
                                    </StyledTableCell> */}
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

TasksTable.propTypes = {
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
    disableClick: PropTypes.bool,
    // sku: PropTypes.string,
    // handleSkuChange:PropTypes.func,
}

export default TasksTable;