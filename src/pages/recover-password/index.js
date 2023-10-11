import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useApi } from '../hooks/useApi.js';
import { CssBaseline, Snackbar } from '@mui/material';

import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import TopNav from '../TopNav.jsx';

const defaultTheme = createTheme();

const REG_PASSWORD = /.{8,}/;

export default function RecoverPassword() {

  const router = useRouter()
  var token = router.query.token;
  var email = router.query.email;

  const [errorPassword, setErrorPassword] = useState("");

  const { changePassword, confirmTokenForgotPassword} = useApi();
  
  useEffect(() => {
    confirmTokenForgotPassword(token);
  }, [token]);
  
  const handleSubmit = (event) => {   
    event.preventDefault();
    const datos = new FormData(event.currentTarget);

    const request = {
        email: email,
        password: datos.get('password')
    };
    changePassword(request);
};

  return (
    
    <ThemeProvider theme={defaultTheme}>
        
    <Grid container component='main' justifyContent='center' direction='row' sx={{ height: '100vh' }}>
        <CssBaseline />
        <Grid
            item
            xs={false}
            sm={4}
            md={7}
            sx={{
                backgroundImage:
                    'url(https://buscatusclases.com/wp-content/uploads/2022/06/profesor-particular-verano-alumnos.jpg)',
                backgroundRepeat: 'no-repeat',
                backgroundColor: t => (t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900]),
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
            <Box
                sx={{
                    my: 6,
                    mx: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
            
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
                    error= {errorPassword!=""}
                    onBlur={(event) => {
                        if (!REG_PASSWORD.test(event.target.value)){
                            setErrorPassword("Password must be longer than 8 characters");
                        }else{
                            setErrorPassword("");
                        }
                    }}
                    helperText={errorPassword}
                />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Confirm New Password
              </Button>
            </Box>
            </Box>
                </Grid>
            </Grid>
        </ThemeProvider>
  );
}