import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import PropTypes from 'prop-types';
import { ButtonBase, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { styled } from '@mui/material/styles';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';

const CustomWidthTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))({
  [`& .${tooltipClasses.tooltip}`]: {
    width: 170,
    background: 'white',
    //  height:299

  },
});

export default function TasksCard(props) {
  
  return (
    <CustomWidthTooltip arrow title={<TooltipComp />}>
      <ButtonBase>
        <Card elevation={2}
          sx={{
            width: 170,
            '&:hover': {

            }
          }}
        >
          <CardContent>
            <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
              {props.date}
            </Typography>
            <Typography variant="body2" component="div">
              Employee: {`${props.name}`}
            </Typography>
            <Typography variant="body2" component="div">
              Total Task: {props.totalTasks}
            </Typography>
            <Typography variant="body2" component="div">
              Completed: {props.completed}
            </Typography>
          </CardContent>
        </Card>
      </ButtonBase>
    </CustomWidthTooltip>
  );
}

TasksCard.propTypes = {
  name: PropTypes.string,
  dealAyoId: PropTypes.string,
  totalTasks: PropTypes.number,
  completed: PropTypes.number,
  date: PropTypes.string,
}

function TooltipComp() {
  const [assignTo, setAssignTo] = React.useState('');
  return (
    <>
      <FormControl size="small" fullWidth>
        <InputLabel id="demo-simple-select-label">Assign To</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={assignTo}
          label="Assign To"
          onChange={e => setAssignTo(e.target.value)}
        >
          <MenuItem value="">None</MenuItem>
          <MenuItem value="d01">Sabin</MenuItem>
          <MenuItem value="d02">Adit</MenuItem>
          <MenuItem value="d03">Jenis</MenuItem>
        </Select>
      </FormControl>
    </>
  )
}