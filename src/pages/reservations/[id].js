// Mui
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Typography,
} from '@mui/material';

// Hooks
import { useState } from 'react';

// Components
import Calendar from './components/Calendar';
import HorizontalProfessorCard from './components/HorizontalProfessorCard';

// Utils
import { order_and_group } from '@/utils/order_and_group';

const teacher = {
    name: 'Luis',
    email: 'luis@uca.edu.ar',
    phone: 67890,
    office: 'UCA',
    subjects: ['Math', 'Chemistry'],
    price: 50,
};

export default function Reservation() {
    const [selectedBlocks, setSelectedBlocks] = useState([]);
    const [subject, setSubject] = useState(teacher.subjects[0]);
    const [showConfirmReservation, setShowConfirmationReservation] = useState(false);

    const handleCancel = () => {
        setSelectedBlocks([]);
        setShowConfirmationReservation(false);
    };

    const handleReserve = () => {
        let adaptedReservation = selectedBlocks.map(block => {
            const time = block.time.trim();
            return {
                day: block.day,
                startTime: time.split('-')[0],
                endTime: time.split('-')[1],
            };
        });
        handleCancel();
        console.log(adaptedReservation);
    };

    const handleSubjectChange = e => {
        setSelectedBlocks([]);
        setSubject(e.target.value);
    };

    const handleConfirmationOpen = () => {
        let orderedSelectedBlocks = order_and_group(selectedBlocks);
        setSelectedBlocks(orderedSelectedBlocks);
        setShowConfirmationReservation(true);
    };

    return (
        <div>
            <div style={{ display: 'flex', width: '90%', margin: '2rem auto', alignItems: 'end', justifyContent: 'space-between' }}>
                <HorizontalProfessorCard professor={teacher} />

                <FormControl sx={{ minWidth: 150 }}>
                    <InputLabel>Subject</InputLabel>
                    <Select value={subject} label='Subject' onChange={e => handleSubjectChange(e)}>
                        {teacher.subjects.map(subject => (
                            <MenuItem value={subject} key={subject}>
                                {subject}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </div>

            <Calendar selectedBlocks={selectedBlocks} setSelectedBlocks={setSelectedBlocks} />

            <div style={{ display: 'flex', justifyContent: 'right', margin: '1rem auto', width: '90%' }}>
                <Button onClick={handleCancel}>Cancel</Button>
                <Button variant='contained' onClick={handleConfirmationOpen} disabled={selectedBlocks.length === 0}>
                    Reserve
                </Button>
            </div>

            <Dialog open={showConfirmReservation}>
                <DialogTitle>Confirm Reservation</DialogTitle>
                <DialogContent dividers>
                    <div style={{ display: 'flex' }}>
                        <div style={{ paddingInline: '2rem' }}>
                            {selectedBlocks.map(block => (
                                <Typography key={block.time + block.day}>{block.day + ' ' + block.time}</Typography>
                            ))}
                        </div>
                        <Divider orientation='vertical' flexItem />
                        <div style={{ paddingInline: '2rem' }}>
                            <Typography>{`Subject: ${subject}`}</Typography>
                            <Typography>{`Price per hour: $${teacher.price}`}</Typography>
                            <Typography>{`Total: $${(teacher.price * selectedBlocks.length) / 2}`}</Typography>
                        </div>
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancel}>Cancel</Button>
                    <Button variant='contained' onClick={handleReserve}>
                        Reserve
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
