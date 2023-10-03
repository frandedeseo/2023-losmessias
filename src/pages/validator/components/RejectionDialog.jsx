// Mui
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

// Styles
import { styles } from '../styles';

export default function RejectionDialog({ open, setOpen, reject, teacher }) {
    const handleReject = () => {
        reject();
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Do you want to reject this teacher?</DialogTitle>

            <DialogContent>
                <DialogContentText>{teacher.name}</DialogContentText>
            </DialogContent>

            <DialogActions sx={styles.dialogButtons}>
                <Button variant='contained' color='error' onClick={handleReject}>
                    Reject
                </Button>
                <Button onClick={handleClose}>Cancel</Button>
            </DialogActions>
        </Dialog>
    );
}
