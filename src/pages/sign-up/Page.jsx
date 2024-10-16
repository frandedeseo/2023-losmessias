import React, { useEffect, useState } from 'react';
import { CssBaseline, Paper, Box, Grid, ThemeProvider, CircularProgress, Snackbar, Alert } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import LogIn from './LogIn';
import SignUp from './SignUp';
import TransferList from './TransferList';
import ForgotPassword from './ForgotPassword';
import { useRouter } from 'next/router';

const defaultTheme = createTheme();

export default function Page({ page, setPage }) {
    const [request, setRequest] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [stateSnackbar, setStateSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const router = useRouter();

    useEffect(() => {
        setIsLoading(true);
        if (router.isReady) {
            setIsLoading(false);
        }
    }, [router]);

    return (
        <ThemeProvider theme={defaultTheme}>
            {isLoading ? (
                <Box
                    sx={{
                        height: 300,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <CircularProgress />
                </Box>
            ) : (
                <>
                    <Grid container component='main' justifyContent='center' direction='row' sx={{ height: '91vh' }}>
                        <CssBaseline />
                        {page !== 'transferlist' && (
                            <>
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
                                        {page === 'signup' && <SignUp setRequest={setRequest} setPage={setPage} />}
                                        {page === 'forgot-password' && <ForgotPassword setPage={setPage} />}
                                        {page === 'login' && <LogIn setPage={setPage} />}
                                    </Box>
                                </Grid>
                            </>
                        )}
                        {page === 'transferlist' && (
                            <TransferList request={request} setPage={setPage} setStateSnackbar={setStateSnackbar} />
                        )}
                    </Grid>
                    <Snackbar
                        open={stateSnackbar.open}
                        autoHideDuration={6000}
                        onClose={() => setAlert({ ...alert, open: false })}
                        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                    >
                        <Alert
                            onClose={() => setStateSnackbar({ open: false, message: '', severity: 'success' })}
                            severity={stateSnackbar.severity}
                            sx={{ width: '100%' }}
                        >
                            {stateSnackbar.message}
                        </Alert>
                    </Snackbar>
                </>
            )}
        </ThemeProvider>
    );
}
