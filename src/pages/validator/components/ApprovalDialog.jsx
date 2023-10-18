// Mui
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle
} from '@mui/material';

// Hooks
import { useState } from 'react';

// Styles
import { styles } from '../../../styles/validator-styles';

export default function ApprovalDialog({ open, setOpen, approve, teacher }) {
    const teacherName = teacher ? teacher.name : 'Loading...';
    const handleApprove = () => {
        approve();
    };
    const handleClose = () => {
        setOpen(false);
    };

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Do you want to approve this teacher?</DialogTitle>

            <DialogContent>
                <DialogContentText>{teacherName}</DialogContentText>
            </DialogContent>

            <DialogActions sx={styles.dialogButtons}>
                <Button variant='contained' onClick={handleApprove}>
                    Approve
                </Button>
                <Button onClick={handleClose}>Cancel</Button>
            </DialogActions>
        </Dialog>
    );
}
