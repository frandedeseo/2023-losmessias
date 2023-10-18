import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Image from 'next/image';


export default function TopNav({ setPage }) {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Image
            width={40}
            height={40}
            src={'https://icons.iconarchive.com/icons/paomedia/small-n-flat/512/book-bookmark-icon.png'}
            alt="logo"
          />
          <Typography variant="h4" component="div" sx={{ flexGrow: 1 }}>
            Leherer
          </Typography>

          <Button color="inherit"
            onClick={() => {
              setPage("login")
            }}>LogIn</Button>
          <Button color="inherit"
            onClick={() => {
              setPage("signup")
            }}>SignUp</Button>

        </Toolbar>
      </AppBar>
    </Box>
  );
}