import { Snackbar } from '@mui/material';
import MuiAlert from '@mui/material/Alert';

export default function Alert({open, setOpen, message, severity}){
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
        setOpen(false);
    };
    return (
    <Snackbar anchorOrigin={{vertical: 'top', horizontal: "center"}} open={open} autoHideDuration={4000} onClose={handleClose} message={message}  key={'top' + 'center'}>
        <MuiAlert elevation={6} onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
            {message}
        </MuiAlert>
    </Snackbar>
    );
}