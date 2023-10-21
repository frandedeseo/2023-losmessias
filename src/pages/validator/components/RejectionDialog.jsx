// Mui
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

// Styles
import { styles } from '../../../styles/validator-styles';

export default function RejectionDialog({ open, setOpen, reject, teacher }) {
    const teacherName = teacher ? teacher.name : 'Loading...';
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
                <DialogContentText>{teacherName}</DialogContentText>
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
