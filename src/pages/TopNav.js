import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';

export default function TopNav( {setLogInForm, setSignUpForm, setTransferList} ) {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            ONLINE LEARNING GROUP
          </Typography>
          <Button color="inherit" 
              onClick={() => {
                setLogInForm(true);
                setSignUpForm(false);
                setTransferList(false);
              }}
          >Log In
          </Button>
          <Button color="inherit"
              onClick={() => {
                setLogInForm(false);
                setSignUpForm(true);
                setTransferList(false);
              }}
          >Sign Up</Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}