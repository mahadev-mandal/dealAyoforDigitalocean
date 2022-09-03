import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Slide from "@mui/material/Slide";
import AddIcon from "@mui/icons-material/Add";
import { Stack } from "@mui/material";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function AssignTasks() {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button variant="contained"  color="success" onClick={handleClickOpen}>
        <AddIcon /> Add
      </Button>
      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: "relative" }}>
          <Toolbar>
            <Stack
              direction="row"
              sx={{ width: "100%" }}
              justifyContent="space-between"
              alignItems="center"
            >
              <IconButton
                edge="start"
                color="inherit"
                onClick={handleClose}
                aria-label="close"
              >
                <CloseIcon />
              </IconButton>

              <Stack spacing={1} direction="row">
                <Button color="inherit">Verify</Button>
                <Button
                  color="inherit"
                  // onClick={handleSave}
                  // disabled={data.length < 1}
                >
                  save
                </Button>
              </Stack>
            </Stack>
          </Toolbar>
        </AppBar>
      </Dialog>
    </div>
  );
}
