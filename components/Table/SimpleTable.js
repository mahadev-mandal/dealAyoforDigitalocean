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
import { returnStyle } from '../../controllers/returnStyle';
import copyToClipboard from '../../controllers/copyToClipboard';


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


export default function SimpleTable({
    tableHeading,
    data,
    dataHeading,
    page,
    rowsPerPage,
    totalCount,
    handleChangePage,
    handleChangeRowsPerPage,
    ExtraCells,
    type,
    selected,
    onSelectChange,
    onAllSelectChange

}) {
    const returnComp = (Comp, row, head) => <Comp row={row} head={head} />
    const allSelectChecker = () => {
        if (selected.length > 0) {
            return data.map(p => p._id).every((pid) => selected.map(s => s._id).includes(pid));
        } else {
            return false;
        }
    };
    function returnText(row, head) {
        if (head == 'title') {
            return row[head].replace(
                /\w\S*/g,
                function (txt) {
                    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
                }
            );
        } else if (head == 'model') {
            return row[head].toLowerCase();
        } else {
            if (typeof (row[head]) == 'object') {
                return JSON.stringify(row[head])
            }
            return row[head]
        }
    }
    return (
        <>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 700 }} aria-label="customized table" size="small">
                    <TableHead>
                        <TableRow>
                            <StyledTableCell>S.N</StyledTableCell>
                            {type == 'selectable' &&
                                <StyledTableCell>
                                    <Checkbox
                                        sx={{ color: "white", padding: 0 }}
                                        checked={allSelectChecker()}
                                        onChange={onAllSelectChange}
                                    />
                                </StyledTableCell>
                            }
                            {tableHeading.map((heading) => (
                                <StyledTableCell key={heading}>{heading}</StyledTableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.map((row, index) => (
                            <StyledTableRow key={row._id} style={returnStyle(row)}>
                                <StyledTableCell component="th" scope="row">
                                    {page * rowsPerPage + index + 1}
                                </StyledTableCell>
                                {type == 'selectable' &&
                                    <StyledTableCell>
                                        <Checkbox
                                            sx={{ padding: 0 }}
                                            checked={selected.map(p => p._id).includes(row._id)}
                                            onChange={(e) => onSelectChange(e, row)}
                                        />
                                    </StyledTableCell>
                                }
                                {dataHeading.map((head, i) =>
                                    !(head == '') ?
                                        <StyledTableCell
                                            key={tableHeading[i]}
                                            sx={{
                                                userSelect: 'all'
                                            }}
                                            onClick={(e) => copyToClipboard(e.target.innerText)}
                                            title={row[head]}
                                        >
                                            {returnText(row, head)}
                                        </StyledTableCell>
                                        : <StyledTableCell key={tableHeading[i]}>
                                            {returnComp(ExtraCells[tableHeading[i]], row, tableHeading[i])}
                                        </StyledTableCell>
                                )}
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
    tableHeading: PropTypes.array.isRequired,
    data: PropTypes.array.isRequired,
    dataHeading: PropTypes.array.isRequired,
    page: PropTypes.number.isRequired,
    rowsPerPage: PropTypes.number.isRequired,
    totalCount: PropTypes.number.isRequired,
    handleChangePage: PropTypes.func.isRequired,
    handleChangeRowsPerPage: PropTypes.func.isRequired,
    ExtraCells: PropTypes.object,
    type: PropTypes.string,
    selected: PropTypes.array,
    onSelectChange: PropTypes.func,
    onAllSelectChange: PropTypes.func
}

