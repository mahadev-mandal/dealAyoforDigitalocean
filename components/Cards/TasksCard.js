import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import PropTypes from 'prop-types';
import { ButtonBase } from '@mui/material';
import styles from './TasksCard.module.css';
import { green } from '@mui/material/colors';
import EditTasksDialog from '../FullScreenModal/EditTasksDialog';
import parseJwt from '../../controllers/parseJwt';
import Link from 'next/link';
import Cookies from 'js-cookie';
// import moment from 'moment';

// import { styled } from '@mui/material/styles';
// import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';

// const CustomWidthTooltip = styled(({ className, ...props }) => (
//   <Tooltip {...props} classes={{ popper: className }} />
// ))({
//   [`& .${tooltipClasses.tooltip}`]: {
//     width: 170,
//     background: 'white',
//     //  height:299

//   },
// });

const arr = [0, 20, 40, 60, 80, 100];

export default function TasksCard({ tasks, workType }) {
  const completedTasks = tasks.tasks.filter(t => t.entryStatus).length;
  const errorTasks = tasks.tasks.filter(t => t.errorTask).length;
  const commonTasks = tasks.tasks.filter(t => t.entryStatus && t.errorTask).length;
  const total = tasks.tasks.length;

  const getPercent = () => {
    return {
      comp: `${((completedTasks + errorTasks - commonTasks) / total) * 100}%`,
      err: `${((errorTasks) / total) * 100}%`,
    }
  }

  const returnColorNum = () => {
    return arr.filter(a => a >= ((completedTasks + errorTasks - commonTasks) / total) * 100)[0] * 5
  }

  return (
    // <CustomWidthTooltip arrow title={<TooltipComp />}>
    <Link href={`/tasks/${workType == 'Data Entry' ? tasks.taskId : 'update/' + tasks.taskId}`}>
      <a>
        <ButtonBase>
          <Card elevation={2}
            sx={{
              width: 200,
              "&::before": {
                width: '100%',
                height: getPercent().comp,
                background: green[returnColorNum()],
                transition: '0.3s',
              },
              "&::after": {
                width: '100%',
                height: getPercent().err,
              },

            }}
            className={styles.card}
          >
            {parseJwt}
            <CardContent>
              <Typography variant="body2" component="div" color="#FF00FF" sx={{ textDecoration: 'underline' }}>
                {workType}
              </Typography>
              <Typography variant="body2" component="div">
                Task-{`${tasks.taskId}`}
              </Typography>
              <Typography sx={{ fontSize: 13.5, fontWeight: 'bold' }} color="text.secondary" gutterBottom>
                {new Date(tasks.date).toDateString()}
              </Typography>
              {parseJwt(Cookies.get('token')).role == 'super-admin' && <EditTasksDialog />}
              <Typography
                variant="body2"
                component="div"
                sx={{
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden'
                }}
              >
                Employee: <span style={{ fontWeight: 'bold' }}>{tasks.assignToName}</span>
              </Typography>
              <Typography variant="body2" component="div">
                Total Task: <span style={{ fontWeight: 'bold' }}>{tasks.tasks.length}</span>
              </Typography>
              <Typography variant="body2" component="div">
                Completed: <span style={{ fontWeight: 'bold' }}>{completedTasks}</span>
              </Typography>
              <Typography variant="body2" component="div">
                Errors: <span style={{ fontWeight: 'bold' }}>{errorTasks}</span>
              </Typography>
            </CardContent>
          </Card>
        </ButtonBase >
      </a>
    </Link>
    // </CustomWidthTooltip>
  );
}

TasksCard.propTypes = {
  tasks: PropTypes.object,
  workType: PropTypes.string,
}

// function TooltipComp() {
//   const [assignTo, setAssignTo] = React.useState('');
//   return (
//     <>
//       <FormControl size="small" fullWidth>
//         <InputLabel id="demo-simple-select-label">Assign To</InputLabel>
//         <Select
//           labelId="demo-simple-select-label"
//           id="demo-simple-select"
//           value={assignTo}
//           label="Assign To"
//           onChange={e => setAssignTo(e.target.value)}
//         >
//           <MenuItem value="">None</MenuItem>
//           <MenuItem value="d01">Sabin</MenuItem>
//           <MenuItem value="d02">Adit</MenuItem>
//           <MenuItem value="d03">Jenis</MenuItem>
//         </Select>
//       </FormControl>
//     </>
//   )
// }