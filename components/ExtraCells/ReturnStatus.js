import PropTypes from 'prop-types';
const ReturnStatus = ({ row }) => {
    return (
        <>
            {row.status ? 'Active' : 'Disabled'}
        </>
    )
}

ReturnStatus.propTypes = {
    row: PropTypes.object
}

export default ReturnStatus;