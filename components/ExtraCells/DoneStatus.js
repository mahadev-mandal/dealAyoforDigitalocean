import { Checkbox } from '@mui/material';
import axios from 'axios';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import { mutate } from 'swr';
import { baseURL } from '../../helpers/constants';

const DoneStatus = ({ row, head }) => {
    const router = useRouter();
    const { fid } = router.query;
    const handleStatusChange = async (event) => {
        let date = null;
        if (event.target.checked) {
            date = new Date();
        } else {
            date = ''
        }
        let update;

        if (head == 'doneStatus') {
            update = {
                doneStatus: event.target.checked,
                doneDate: date,
            }
        } else {
            update = {
                errorTask: event.target.checked,
            }
        }
        await axios.put(`${baseURL}/api/files/${row._id}`, { ...update, taskId: fid })
            .then(() => {
                mutate(`${baseURL}/api/tasks/file-tasks/${fid}`)
            }).catch((err) => {
                console.log(err)
            })
    }

    return (
        <>
            <Checkbox
                checked={head == 'doneStatus' ? row.doneStatus : row.errorTask}
                onChange={handleStatusChange}
                sx={{ padding: 0 }}
            />
        </>
    )
}
DoneStatus.propTypes = {
    row: PropTypes.object,
    head: PropTypes.string,
}

export default DoneStatus;