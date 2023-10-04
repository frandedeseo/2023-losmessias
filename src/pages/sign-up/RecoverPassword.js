import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useApi } from '../hooks/useApi.js';
import { Snackbar } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import Alert from '../../components/Alert.js';

const defaultTheme = createTheme();


export default function RecoverPassword() {

  const { data, changePassword } = useApi();
  const [open, setOpen] = React.useState(false);


  
  const handleSubmit = (event) => {   
    event.preventDefault();
    const datos = new FormData(event.currentTarget);
    
    const request = {
        email: "gonzaloh@gmail.com",
        password: datos.get('password')
    };
    changePassword(request);
    {data.status==200 && (
        setOpen(true)
    )}
};

  return (
          <>
            <Typography component="h1" variant="h5">
                Recover Password
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 , marginTop: 5}}>
                <Typography component="h7" variant="h7">
                    Write the new password
                </Typography>
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="current-password"
                />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Confirm New Password
              </Button>
              <Alert open={open} setOpen={setOpen} message={"Password was changed successfully"} severity={"success"}>
              </Alert>
            </Box>
          </>
  );
}