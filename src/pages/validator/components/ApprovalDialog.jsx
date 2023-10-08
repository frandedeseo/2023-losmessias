// Mui
import {
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    FormControl,
    InputLabel,
    ListItemText,
    MenuItem,
    OutlinedInput,
    Select,
} from '@mui/material';

// Hooks
import { useState } from 'react';

// Styles
import { styles } from '../styles';

export default function ApprovalDialog({ open, setOpen, approve, teacher }) {
    const [selectedSubjects, setSelectedSubjects] = useState(teacher.subjects);

    const handleChange = e => {
        setSelectedSubjects(typeof e.target.value === 'string' ? e.target.value.split(',') : e.target.value);
    };

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
                <DialogContentText>{teacher.name}</DialogContentText>
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
