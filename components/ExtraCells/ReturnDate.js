import PropTypes from 'prop-types';
const ReturnDate = ({ row }) => {
    return (
        <>
            {row.assignDate && new Date(row.assignDate).toDateString()}
        </>
    )
}

ReturnDate.propTypes = {
    row: PropTypes.object
}

export default ReturnDate;