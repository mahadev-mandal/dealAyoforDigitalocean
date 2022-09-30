import { Checkbox } from '@mui/material';
import axios from 'axios';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import { mutate } from 'swr';
import { baseURL } from '../../helpers/constants';

const EntryOrError = ({ row, head }) => {
    const router = useRouter();
    const { tid } = router.query;
    const handleStatusChange = async (event) => {
        let date = null;
        if (event.target.checked) {
            date = new Date();
        } else {
            date = ''
        }
        let update;

        if (head == 'entry') {
            update = {
                entryStatus: event.target.checked,
                date: date,
            }
        } else {
            update = {
                errorTask: event.target.checked,
            }
        }
        await axios.put(`${baseURL}/api/products/${row._id}`, { ...update, taskId: tid })
            .then(() => {
                mutate(`${baseURL}/api/tasks/${tid}`)
            }).catch((err) => {
                console.log(err)
            })
    }

    return (
        <>
            <Checkbox
                checked={head == 'entry' ? row.entryStatus : row.errorTask}
                onChange={handleStatusChange}
                sx={{ padding: 0 }}
            />
        </>
    )
}
EntryOrError.propTypes = {
    row: PropTypes.object,
    head: PropTypes.string,
}

export default EntryOrError;