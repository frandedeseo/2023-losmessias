import { Grid, IconButton, InputAdornment, TextField } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useEffect, useState } from 'react';

const REG_PASSWORD = /.{8,}/;

export default function PasswordComponent({ setPasswordValidated }) {
    const [showPassword1, setShowPassword1] = useState(false);
    const [errorPassword1, setErrorPassword1] = useState('');
    const [showPassword2, setShowPassword2] = useState(false);
    const [errorPassword2, setErrorPassword2] = useState('');
    const [firstPassword, setFirstPassword] = useState('');
    const [secondPassword, setSecondPassword] = useState('');

    const handleClickShowPassword1 = () => setShowPassword1(show => !show);
    const handleClickShowPassword2 = () => setShowPassword2(show => !show);

    const handleMouseDownPassword = event => {
        event.preventDefault();
    };

    useEffect(() => {
        if (
            REG_PASSWORD.test(firstPassword) &&
            REG_PASSWORD.test(secondPassword) &&
            firstPassword === secondPassword &&
            errorPassword1 === '' &&
            errorPassword2 === ''
        ) {
            setPasswordValidated(true);
        } else {
            setPasswordValidated(false);
        }
    }, [firstPassword, secondPassword, errorPassword1, errorPassword2, setPasswordValidated]);

    return (
        <>
            <Grid item xs={12} sm={6}>
                <TextField
                    required
                    fullWidth
                    name='password'
                    label='Password'
                    id='password1'
                    type={showPassword1 ? 'text' : 'password'}
                    error={errorPassword1 !== ''}
                    onChange={event => setFirstPassword(event.target.value)}
                    value={firstPassword}
                    onBlur={event => {
                        if (!REG_PASSWORD.test(event.target.value)) {
                            setErrorPassword1('Password must be at least 8 characters');
                        } else {
                            setErrorPassword1('');
                        }
                    }}
                    helperText={errorPassword1}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position='end'>
                                <IconButton
                                    aria-label='toggle password visibility'
                                    onClick={handleClickShowPassword1}
                                    onMouseDown={handleMouseDownPassword}
                                    edge='end'
                                >
                                    {showPassword1 ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField
                    required
                    fullWidth
                    name='confirmPassword'
                    label='Repeat Password'
                    id='password2'
                    type={showPassword2 ? 'text' : 'password'}
                    error={errorPassword2 !== ''}
                    onChange={event => setSecondPassword(event.target.value)}
                    value={secondPassword}
                    onBlur={event => {
                        if (!REG_PASSWORD.test(event.target.value)) {
                            setErrorPassword2('Password must be at least 8 characters');
                        } else if (event.target.value !== firstPassword) {
                            setErrorPassword2('Passwords must match');
                        } else {
                            setErrorPassword2('');
                        }
                    }}
                    helperText={errorPassword2}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position='end'>
                                <IconButton
                                    aria-label='toggle password visibility'
                                    onClick={handleClickShowPassword2}
                                    onMouseDown={handleMouseDownPassword}
                                    edge='end'
                                >
                                    {showPassword2 ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />
            </Grid>
        </>
    );
}
