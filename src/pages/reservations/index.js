import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { useState } from 'react';
import Calendar from './components/Calendar';

const teacher = {
    name: 'Luis',
    email: 'luis@uca.edu.ar',
    phone: 67890,
    office: 'UCA',
    officeHours: '09:00-18:00',
    subjects: ['Math', 'Chemistry'],
    price: 50,
};

export default function Reservations() {
    const [selectedBlocks, setSelectedBlocks] = useState([]);
    const [subject, setSubject] = useState('');
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

    return (
        <div>
            <h2>{`${teacher.name}  ${teacher.office}`}</h2>
            <p>{`${teacher.email}  ${teacher.phone}`}</p>

            <FormControl sx={{ minWidth: 120 }}>
                <InputLabel>Subject</InputLabel>
                <Select value={subject} label='Subject' onChange={e => setSubject(e.target.value)}>
                    {teacher.subjects.map(subject => (
                        <MenuItem value={subject} key={subject}>
                            {subject}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            <Calendar selectedBlocks={selectedBlocks} setSelectedBlocks={setSelectedBlocks} />

            <div style={{ display: 'flex', justifyContent: 'rigt', margin: '1rem auto', width: '90%' }}>
                <Button onClick={handleCancel}>Cancel</Button>
                <Button variant='contained' onClick={() => setShowConfirmationReservation(true)} disabled={selectedBlocks.length === 0}>
                    Reserve
                </Button>
            </div>

            <Dialog open={showConfirmReservation}>
                <DialogTitle>Confirm Reservation</DialogTitle>
                <DialogContent dividers>
                    <p>{`Price per hour: $${teacher.price}`}</p>
                    <p>{`Subject: ${subject}`}</p>
                    {selectedBlocks.map(block => (
                        <p key={block.time + block.day}>{block.day + ' ' + block.time}</p>
                    ))}
                    <p>{`Total: $${teacher.price * selectedBlocks.length}`}</p>
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
