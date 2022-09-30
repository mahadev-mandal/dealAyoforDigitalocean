import PropTypes from 'prop-types';

const ReturnTime = ({ row }) => {
    return row.entryDate && new Date(row.entryDate).toLocaleTimeString();
}


ReturnTime.propTypes = {
    row: PropTypes.object,
}

export default ReturnTime;