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
import { Alert, Snackbar } from '@mui/material';

const defaultTheme = createTheme();

export default function ForgotPassword( {setSignUpForm, setForgotPassword} ) {

  const { data, validateEmailForPasswordChange } = useApi();
  const [open, setOpen] = React.useState(false);

  const handleClose = (event, reason) => {
      if (reason === 'clickaway') {
        return;
      }
      setOpen(false);
  };
  
  const handleSubmit = (event) => {   
    const datos = new FormData(event.currentTarget);
    
    const request = {
        email: datos.get('email')
    };
    validateEmailForPasswordChange(request);
    {data && (
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
                    We will send you an email for confirmation
                </Typography>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Send Email
              </Button>
              <Grid container justifyContent="flex-end">
                <Grid item>
                  <Link href="#" variant="body2"
                    onClick={() => {
                      setSignUpForm(true);
                      setForgotPassword(false);
                  }}
                  >
                    {"Don't have an account? Sign Up"}
                  </Link>
                </Grid>
              </Grid>
                <Snackbar anchorOrigin={{vertical: 'top', horizontal: "center"}} open={open} autoHideDuration={6000} onClose={handleClose} message={"The email was sent successfully"}  key={'top' + 'center'}>
                    <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
                        The email was sent successfully
                    </Alert>
                </Snackbar>

            </Box>
          </>
  );
}