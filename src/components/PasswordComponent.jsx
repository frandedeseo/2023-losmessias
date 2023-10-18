import { IconButton, InputAdornment, OutlinedInput, Snackbar } from '@mui/material';
import { Password, Visibility, VisibilityOff } from '@mui/icons-material';
import TextField from '@mui/material/TextField';
import { useState } from 'react';

const REG_PASSWORD = /.{8,}/;

export default function PasswordComponent(){

    const [showPassword, setShowPassword] = useState(false);

    const [errorPassword, setErrorPassword] = useState("");

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };
  

    return(
        <TextField
            required
            fullWidth
            name="password"
            label="Password"
            id="password"
            type={showPassword ? 'text' : 'password'}
            error= {errorPassword!=""}
            onBlur={(event) => {
                if (!REG_PASSWORD.test(event.target.value)){
                    setErrorPassword("Password must be longer than 8 characters");
                }else{
                    setErrorPassword("");
                }
            }}
            helperText={errorPassword}
            InputProps={{ 
                endAdornment:
                    <InputAdornment position="end">
                        <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                            >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                    </InputAdornment>
            }}
        />
    );
}