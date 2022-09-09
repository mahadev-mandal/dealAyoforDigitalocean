import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import PropTypes from 'prop-types';
import { ButtonBase, } from '@mui/material';
import { useRouter } from 'next/router';
import { baseURL } from '../../helpers/constants';
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
export default function TasksCard({ tasks }) {
  const router = useRouter();

  const handleTaskClick = (tid) => {
    router.push(`${baseURL}/tasks/${tid}`);
  }

  return (
    // <CustomWidthTooltip arrow title={<TooltipComp />}>
    <ButtonBase onClick={() => handleTaskClick(tasks[0].tasksId)}>
      <Card elevation={2}
        sx={{
          width: 170,
          '&:hover': {

          }
        }}
      >
        <CardContent>
          <Typography variant="body2" component="div">
            Task-{`${tasks[0].tasksId}`}
          </Typography>
          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            {new Date(tasks[0].assignDate).toDateString()}
          </Typography>
          <Typography variant="body2" component="div">
            Employee: {tasks[0].assignToDealAyoId ? tasks[0].assignToName : ''}
          </Typography>
          <Typography variant="body2" component="div">
            Total Task: {tasks.length}
          </Typography>
          <Typography variant="body2" component="div">
            Completed: {tasks.filter(t => t.entryStatus === true).length}
          </Typography>
        </CardContent>
      </Card>
    </ButtonBase>
    // </CustomWidthTooltip>
  );
}

TasksCard.propTypes = {
  tasks: PropTypes.array,
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