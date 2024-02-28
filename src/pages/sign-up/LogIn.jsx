import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { useApi } from '../../hooks/useApi.js';
import Alert from '../../components/Alert.jsx';
import { useState } from 'react';
import { CircularProgress } from '@mui/material';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import { useUserDispatch } from '@/context/UserContext';
import { useRouter } from 'next/router.js';

export default function LogIn({ setPage }) {
    const [error, setError] = useState();
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [alertState, setAlertState] = useState(null);
    const dispatch = useUserDispatch();
    const router = useRouter();

    const handleSubmit = event => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const request = {
            emailRequest: data.get('email'),
            passwordRequest: data.get('password'),
        };
        axios.post('../api/login', request).then(async response => {
            if (response.status == 200) {
                const decoded = jwt_decode(response.data.token);
                const id = decoded.id;
                const firstName = decoded.name;
                const lastName = decoded.surname;
                const email = decoded.sub;
                const role = decoded.role.toLowerCase();
                dispatch({
                    type: 'login',
                    payload: { id: id, token: response.data.token, role: role, email: email, firstName: firstName, lastName: lastName },
                });
                if (role == 'professor') {
                    router.push('/professor-landing');
                } else if (role == 'student') {
                    router.push('/student-landing');
                } else {
                    router.push('/admin-landing');
                }
            } else {
                setOpen(true);
                setAlertState({ open: true, message: 'The credentials were incorrect', severity: 'error' });
                setError('error');
            }
        });
    };

    return (
        <>
            {alertState && <Alert open={open} setOpen={setOpen} message={alertState.message} severity={alertState.severity} />}

            <Typography component='h1' variant='h5'>
                Log In
            </Typography>
            <Box component='form' noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
                <TextField
                    error={error != ''}
                    margin='normal'
                    required
                    fullWidth
                    id='email'
                    label='Email Address'
                    name='email'
                    autoComplete='email'
                    autoFocus
                    onBlur={() => setError('')}
                />
                <TextField
                    error={error != ''}
                    margin='normal'
                    required
                    fullWidth
                    name='password'
                    label='Password'
                    type='password'
                    id='password'
                    onBlur={() => setError('')}
                    autoComplete='current-password'
                />
                <FormControlLabel control={<Checkbox value='remember' color='primary' />} label='Remember me' />
                <Button type='submit' fullWidth variant='contained' sx={{ mt: 3, mb: 2 }} disabled={isLoading}>
                    {isLoading && <CircularProgress size={20} style={{ marginRight: 10 }} />}
                    Log In
                </Button>
                <Grid container>
                    <Grid item xs>
                        <Link
                            href='#'
                            variant='body2'
                            onClick={() => {
                                setPage('forgot-password');
                            }}
                        >
                            Forgot password?
                        </Link>
                    </Grid>
                    <Grid item>
                        <Link href='#' variant='body2' onClick={() => setPage('signup')}>
                            {"Don't have an account? Sign Up"}
                        </Link>
                    </Grid>
                </Grid>
            </Box>
        </>
    );
}
