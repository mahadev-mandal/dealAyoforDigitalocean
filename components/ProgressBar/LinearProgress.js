import { Stack } from "@mui/material";
import { green } from "@mui/material/colors";
import PropTypes from 'prop-types';

export default function LinearProgressBar({ data }) {
    let total = 0;
    let completed = 0;
    // let errors = 0;
    // let common = 0;
    data.map((task) => {
        total += task.tasks.length;
        completed += task.tasks.filter(t => t.entryStatus).length;
        // errors += task.tasks.filter(t => t.errorTask).length;
        // common += task.tasks.filter(t => t.errorTask & t.entryStatus).length;
    })
    const efficiency = Math.round((completed / total) * 100)
    return (
        <Stack
            alignItems="center"
            justifyContent="center"
            sx={{
                width: 300,
                height: 35,
                borderRadius: 2,
                textAlign: "center",
                position: 'relative',
                border: '1px solid green',
                '&:before': {
                    position: 'absolute',
                    zIndex: -1,
                    left: 0,
                    top: 0,
                    width: `${efficiency}%`,
                    height: '99%',
                    content: "''",
                    background: green[400],
                    borderRadius: 2,
                }
            }}
        >
            Efficiency: {efficiency}%
        </Stack>
    );
}

LinearProgressBar.propTypes = {
    data: PropTypes.array,
}