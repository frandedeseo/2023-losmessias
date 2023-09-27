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
        // <Dialog open={open} onClose={handleClose}>
        //     <DialogTitle>{'Approve teacher: ' + teacher.name}</DialogTitle>

        //     <DialogContent>
        //         <FormControl sx={styles.form}>
        //             <InputLabel>Subjects</InputLabel>
        //             <Select
        //                 multiple
        //                 value={selectedSubjects}
        //                 onChange={handleChange}
        //                 input={<OutlinedInput label='Subjects' />}
        //                 renderValue={selected => selected.join(', ')}
        //             >
        //                 {teacher.subjects.map(subject => (
        //                     <MenuItem key={subject} value={subject}>
        //                         <Checkbox checked={selectedSubjects.indexOf(subject) > -1} />
        //                         <ListItemText primary={subject} />
        //                     </MenuItem>
        //                 ))}
        //             </Select>
        //         </FormControl>
        //     </DialogContent>

        //     <DialogActions sx={styles.dialogButtons}>
        //         <Button variant='contained' onClick={handleApprove}>
        //             Approve
        //         </Button>
        //         <Button onClick={handleClose}>Cancel</Button>
        //     </DialogActions>
        // </Dialog>

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
