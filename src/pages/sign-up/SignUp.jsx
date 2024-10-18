import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { useState, useEffect } from 'react';
import { useApi } from '@/hooks/useApi.js';
import Alert from '@/components/Alert';
import { CircularProgress } from '@mui/material';

// Regular expressions for validation
const REG_ONLY_LETTERS = /^[ a-zA-ZÀ-ÿ\u00f1\u00d1]*$/;
const REG_ONLY_NUM = /^[0-9]*$/;
const REG_EMAIL = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
const REG_PASSWORD = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/; // At least 8 characters, one letter and one number

export default function SignUp({ setRequest, setPage }) {
    const { open, showAlert, setOpen, alertState, sendRequestForRegistration, validateEmailNotTaken } = useApi();

    const [role, setRole] = useState('Student');
    const [sex, setSex] = useState('MALE');
    const [isLoading, setIsLoading] = useState(false);

    // State variables for form fields
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [location, setLocation] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // State variables for validation errors
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');

    // Disable submit button if any field is empty or validations fail
    const isFormValid =
        firstName &&
        lastName &&
        email &&
        location &&
        phone &&
        password &&
        confirmPassword &&
        !emailError &&
        !passwordError &&
        !confirmPasswordError;

    const handleSubmit = async event => {
        event.preventDefault();

        const req = {
            firstName,
            lastName,
            email,
            password,
            sex,
            location,
            phone,
            role,
        };
        setRequest(req);

        if (role === 'Student') {
            sendRequestForRegistration(req, setIsLoading);
        } else {
            setIsLoading(true);
            fetch(`${process.env.NEXT_PUBLIC_API_URI}/api/validate-email?email=${req.email}`, { method: 'POST' })
                .then(response => {
                    if (response.status === 200) {
                        setTimeout(() => setPage('transferlist'), 600);
                    } else {
                        showAlert({ message: 'Email already taken', status: 500 });
                    }
                })
                .finally(() => setIsLoading(false));
        }
    };

    // Email validation
    const validateEmail = value => {
        if (!REG_EMAIL.test(value)) {
            setEmailError('Invalid email format');
        } else {
            setEmailError('');
        }
    };

    // Password validation
    const validatePassword = value => {
        if (!REG_PASSWORD.test(value)) {
            setPasswordError('Password must be at least 8 characters long and include at least one letter and one number');
        } else {
            setPasswordError('');
        }
    };

    // Confirm password validation
    const validateConfirmPassword = value => {
        if (value !== password) {
            setConfirmPasswordError('Passwords do not match');
        } else {
            setConfirmPasswordError('');
        }
    };

    return (
        <>
            <Alert open={open} setOpen={setOpen} message={alertState.message} severity={alertState.severity} />
            <Typography component='h1' variant='h5'>
                Sign up
            </Typography>

            <Box component='form' onSubmit={handleSubmit} sx={{ mt: 3 }}>
                <Grid container spacing={2}>
                    <Grid container xs={6} sx={{ marginTop: 2 }} justifyContent={'center'}>
                        <ToggleButtonGroup
                            color='primary'
                            value={role}
                            exclusive
                            onChange={(event, newAlignment) => {
                                if (newAlignment !== null) {
                                    setRole(newAlignment);
                                }
                            }}
                            aria-label='Role'
                        >
                            <ToggleButton value='Student'>Student</ToggleButton>
                            <ToggleButton value='Teacher'>Teacher</ToggleButton>
                        </ToggleButtonGroup>
                    </Grid>

                    <Grid container xs={6} sx={{ marginTop: 2 }} justifyContent={'center'}>
                        <ToggleButtonGroup
                            color='primary'
                            value={sex}
                            exclusive
                            onChange={(event, newAlignment) => {
                                if (newAlignment !== null) {
                                    setSex(newAlignment);
                                }
                            }}
                            aria-label='Sex'
                        >
                            <ToggleButton value='MALE'>Male</ToggleButton>
                            <ToggleButton value='FEMALE'>Female</ToggleButton>
                        </ToggleButtonGroup>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            name='firstName'
                            required
                            fullWidth
                            id='firstName'
                            label='First Name'
                            autoFocus
                            value={firstName}
                            onChange={e => setFirstName(e.target.value)}
                            onKeyDown={event => {
                                if (!REG_ONLY_LETTERS.test(event.key)) {
                                    event.preventDefault();
                                }
                            }}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            required
                            fullWidth
                            id='lastName'
                            label='Last Name'
                            name='lastName'
                            value={lastName}
                            onChange={e => setLastName(e.target.value)}
                            onKeyDown={event => {
                                if (!REG_ONLY_LETTERS.test(event.key)) {
                                    event.preventDefault();
                                }
                            }}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            required
                            fullWidth
                            id='email'
                            label='Email Address'
                            name='email'
                            value={email}
                            onChange={e => {
                                setEmail(e.target.value);
                                validateEmail(e.target.value);
                            }}
                            error={!!emailError}
                            helperText={emailError}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            name='location'
                            required
                            fullWidth
                            id='location'
                            label='Location'
                            value={location}
                            onChange={e => setLocation(e.target.value)}
                            onKeyDown={event => {
                                if (!REG_ONLY_LETTERS.test(event.key)) {
                                    event.preventDefault();
                                }
                            }}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            required
                            fullWidth
                            id='phone'
                            label='Phone Number'
                            name='phone'
                            value={phone}
                            onChange={e => {
                                // Limit the input to a maximum of 10 digits
                                if (e.target.value.length <= 15) {
                                    setPhone(e.target.value);
                                }
                            }}
                            onKeyDown={event => {
                                // Allow only numeric input, backspace, and prevent additional input if length exceeds 10 digits
                                if (
                                    (!REG_ONLY_NUM.test(event.key) && event.keyCode !== 8) ||
                                    (phone.length >= 15 && event.keyCode !== 8) // Prevent more than 10 digits
                                ) {
                                    event.preventDefault();
                                }
                            }}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            required
                            fullWidth
                            name='password'
                            label='Password'
                            type='password'
                            id='password'
                            value={password}
                            onChange={e => {
                                setPassword(e.target.value);
                                validatePassword(e.target.value);
                            }}
                            error={!!passwordError}
                            helperText={passwordError}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            required
                            fullWidth
                            name='confirmPassword'
                            label='Confirm Password'
                            type='password'
                            id='confirmPassword'
                            value={confirmPassword}
                            onChange={e => {
                                setConfirmPassword(e.target.value);
                                validateConfirmPassword(e.target.value);
                            }}
                            error={!!confirmPasswordError}
                            helperText={confirmPasswordError}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <FormControlLabel
                            control={<Checkbox value='allowExtraEmails' color='primary' />}
                            label='I want to receive inspiration, marketing promotions and updates via email.'
                        />
                    </Grid>
                </Grid>

                <Button type='submit' fullWidth variant='contained' sx={{ mt: 3, mb: 2 }} disabled={!isFormValid || isLoading}>
                    {isLoading && <CircularProgress size={24} />}
                    Sign Up
                </Button>

                <Grid container justifyContent='flex-end'>
                    <Grid item xs>
                        <Link href='#' variant='body2' onClick={() => setPage('forgot-password')}>
                            Forgot password?
                        </Link>
                    </Grid>
                    <Grid item>
                        <Link href='#' variant='body2' onClick={() => setPage('login')}>
                            Already have an account? Log in
                        </Link>
                    </Grid>
                </Grid>
            </Box>
        </>
    );
}
