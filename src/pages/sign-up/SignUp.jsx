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
import PasswordComponent from '@/components/PasswordComponent.jsx';
import { useState } from 'react';
import { useApi } from '@/hooks/useApi.js';
import Alert from '@/components/Alert';

const REG_ONLY_LETTERS = /^[ a-zA-ZÀ-ÿ\u00f1\u00d1]*$/;
const REG_ONLY_NUM = /^[0-9]*$/;
const REG_EMAIL = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

export default function SignUp({ setRequest, setPage }) {

    const { open, showAlert, setOpen, alertState, sendRequestForRegistration, validateEmailNotTaken } = useApi();

    const [error, setError] = useState("");
    const [role, setRole] = useState('Student');
    const [sex, setSex] = useState('Male');

    const handleSubmit = async (event) => {
        event.preventDefault();
        var returnValue = false;
        const data = new FormData(event.currentTarget);

        const req = {
            firstName: data.get('firstName'),
            lastName: data.get('lastName'),
            email: data.get('email'),
            password: data.get('password'),
            sex: sex,
            location: data.get('location'),
            phone: data.get('phone'),
            role: role
        };
        setRequest(req);
        if (role == "Student") {
            sendRequestForRegistration(req);
        } else {

            fetch(`${process.env.NEXT_PUBLIC_API_URI}/api/validate-email?email=${req.email}`, { method: 'POST' })
                .then(response => {
                    if (response.status === 200) {
                        setPage("transferlist");
                    } else {
                        showAlert({ message: "Email already taken", status: 500 });
                    }
                })
        }
    };

    return (
        <>
            <Alert open={open} setOpen={setOpen} message={alertState.message} severity={alertState.severity} />
            <Typography component="h1" variant="h5">
                Sign up
            </Typography>

            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>

                <Grid container spacing={2} >
                    <Grid container xs={6} sx={{ marginTop: 2 }} justifyContent={'center'}>
                        <ToggleButtonGroup
                            color="primary"
                            value={role}
                            exclusive
                            onChange={(event, newAlignment) => setRole(newAlignment)}
                            aria-label="Platform"
                        >
                            <ToggleButton value="Student">Student</ToggleButton>
                            <ToggleButton value="Teacher">Teacher</ToggleButton>
                        </ToggleButtonGroup>
                    </Grid>

                    <Grid container xs={6} sx={{ marginTop: 2 }} justifyContent={'center'}>
                        <ToggleButtonGroup
                            color="primary"
                            value={sex}
                            exclusive
                            onChange={(event, newAlignment) => setSex(newAlignment)}
                            aria-label="Platform"
                        >
                            <ToggleButton value="Male">Male</ToggleButton>
                            <ToggleButton value="Female">Female</ToggleButton>
                        </ToggleButtonGroup>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            autoComplete="given-name"
                            name="firstName"
                            required
                            fullWidth
                            id="firstName"
                            label="First Name"
                            autoFocus
                            onKeyDown={(event) => {
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
                            id="lastName"
                            label="Last Name"
                            name="lastName"
                            autoComplete="family-name"
                            onKeyDown={(event) => {
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
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            error={error != ""}
                            onBlur={(event) => {
                                if (!REG_EMAIL.test(event.target.value)) {
                                    setError("Email not valid");
                                } else {
                                    setError("");
                                }
                            }}
                            helperText={error}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            autoComplete="location"
                            name="location"
                            required
                            fullWidth
                            id="location"
                            label="Location"
                            autoFocus
                            onKeyDown={(event) => {
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
                            id="phone"
                            label="Phone Number"
                            name="phone"
                            autoComplete="phone"
                            onKeyDown={(event) => {
                                if (!REG_ONLY_NUM.test(event.key) && event.keyCode != 8) {
                                    event.preventDefault();
                                }
                            }}
                        />
                    </Grid>

                    <PasswordComponent />

                    <Grid item xs={12}>
                        <FormControlLabel
                            control={<Checkbox value="allowExtraEmails" color="primary" />}
                            label="I want to receive inspiration, marketing promotions and updates via email."
                        />
                    </Grid>
                </Grid>
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                >
                    Sign Up
                </Button>
                <Grid container justifyContent="flex-end">
                    <Grid item xs>
                        <Link href="#" variant="body2" onClick={() => setPage("forgot-password")} >
                            Forgot password?
                        </Link>
                    </Grid>
                    <Grid item>
                        <Link href="#" variant="body2" onClick={() => setPage("login")} >
                            Already have an account? Log in
                        </Link>
                    </Grid>
                </Grid>
            </Box>
        </>
    );
}