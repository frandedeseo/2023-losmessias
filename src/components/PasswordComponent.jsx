import { Grid, IconButton, InputAdornment, OutlinedInput, Snackbar } from '@mui/material';
import { Password, Visibility, VisibilityOff } from '@mui/icons-material';
import TextField from '@mui/material/TextField';
import { useState } from 'react';

const REG_PASSWORD = /.{8,}/;

export default function PasswordComponent(){

    const [showPassword1, setShowPassword1] = useState(false);
    const [errorPassword1, setErrorPassword1] = useState("");
    const [showPassword2, setShowPassword2] = useState(false);
    const [errorPassword2, setErrorPassword2] = useState("");
    const [firstPassword, setFirstPassword] = useState('');

    const handleClickShowPassword1 = () => setShowPassword1((show) => !show);
    const handleClickShowPassword2 = () => setShowPassword2((show) => !show);

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };
  
    return(
        <>
        <Grid item xs={12} sm={6}>
            <TextField
                required
                fullWidth
                name="password"
                label="Password"
                id="password"
                type={showPassword1 ? 'text' : 'password'}
                error= {errorPassword1!=""}
                onBlur={(event) => {

                    setFirstPassword(event.target.value);

                    if (!REG_PASSWORD.test(event.target.value)){
                        setErrorPassword1("Password must be longer than 8 characters");
                    }else{
                        setErrorPassword1("");
                    }
                }}
                helperText={errorPassword1}
                InputProps={{ 
                    endAdornment:
                        <InputAdornment position="end">
                            <IconButton
                                aria-label="toggle password visibility"
                                onClick={handleClickShowPassword1}
                                onMouseDown={handleMouseDownPassword}
                                edge="end"
                                >
                                {showPassword1 ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                        </InputAdornment>
                }}
            />
        </Grid>
        <Grid item xs={12} sm={6}>
            <TextField
            required
            fullWidth
            name="password"
            label="Repeat Password"
            id="password"
            type={showPassword2 ? 'text' : 'password'}
            error= {errorPassword2!=""}
            onBlur={(event) => {
                
                if (!REG_PASSWORD.test(event.target.value)){
                    setErrorPassword2("Password must be longer than 8 characters");
                } 
                else if (event.target.value !== firstPassword){
                    setErrorPassword2("The password must be the same");
                }else{
                    setErrorPassword2("");
                }
            }}
            helperText={errorPassword2}
            InputProps={{ 
                endAdornment:
                    <InputAdornment position="end">
                        <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword2}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                            >
                            {showPassword2 ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                    </InputAdornment>
            }}
        />
        </Grid>
    </>
    );
}