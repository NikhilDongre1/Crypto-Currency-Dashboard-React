import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import AppBar from '@mui/material/AppBar';
import Modal from '@mui/material/Modal';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Login from './Login';
import Signup from './Signup';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function AuthModal() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // Set initial value to 0 for the first tab
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div>
      <Button
        variant="contained"
        sx={{
          width: 85,
          height: 40,
          marginLeft: 2,
          backgroundColor: "#EEBC1D",
        }}
        onClick={handleOpen}
      >
        Login
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <AppBar position="static" sx={{ backgroundColor: "transparent", color: "black" }}>
            <Tabs
              value={value}
              onChange={handleChange}
              variant="fullWidth"
              sx={{ borderRadius: 1 }}
            >
              <Tab label="Login" />
              <Tab label="Sign up" />
            </Tabs>
          </AppBar>
          {/* Conditional rendering based on selected tab */}
          {value === 0 && <Login handleClose={handleClose} />}
          {value === 1 && <Signup handleClose={handleClose} />}
        </Box>
      </Modal>
    </div>
  );
}
