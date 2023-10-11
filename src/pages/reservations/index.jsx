// Mui
import {
    Alert,
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
    Snackbar,
    Typography,
} from '@mui/material';

// Hooks
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';

// Components
import Calendar from '@/components/Calendar';
import HorizontalProfessorCard from './components/HorizontalProfessorCard';

// Utils
import { order_and_group } from '@/utils/order_and_group';
import { useUser } from '@/context/UserContext';
import CalendarPagination from '@/components/CalendarPagination';

// Consts
const dayNumber = {
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
    Saturday: 6,
    Sunday: 7,
};

export default function Reservation() {
    const router = useRouter();
    const [selectedBlocks, setSelectedBlocks] = useState([]);
    const [orderedSelectedBlocks, setOrderedSelectedBlocks] = useState([]);
    const [professor, setProfessor] = useState({ subjects: [] });
    const [subject, setSubject] = useState(0);
    const [showConfirmReservation, setShowConfirmationReservation] = useState(false);
    const [week, setWeek] = useState(0);
    const user = useUser();
    const [alert, setAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertSeverity, setAlertSeverity] = useState('');
    const [disabledBlocks, setDisabledBlocks] = useState([]);

    var curr = new Date();
    var first = curr.getDate() - curr.getDay();

    useEffect(() => {
        if (router.isReady) {
            fetch(`http://localhost:8080/api/professor/${router.query.professorId}`).then(res =>
                res.json().then(json => {
                    setProfessor(json);
                })
            );

            fetch(`http://localhost:8080/api/reservation/findByProfessor?professorId=${router.query.professorId}`).then(res =>
                res.json().then(json => {
                    setDisabledBlocks(
                        json.map(e => {
                            if (e.day[2] < 10) e.day[2] = '0' + e.day[2];
                            return e;
                        })
                    );
                })
            );
        }
    }, [router.isReady]);

    const handleCancel = () => {
        setSelectedBlocks([]);
        setShowConfirmationReservation(false);
    };

    const handleReserve = () => {
        orderedSelectedBlocks.forEach(block => {
            const reservation = {
                day: new Date(curr.setDate(first + dayNumber[block.day] + 7 * week)).toISOString().split('T')[0],
                startingHour: block.startingHour,
                endingHour: block.endingHour,
                duration: block.totalHours,
                professorId: professor.id,
                subjectId: professor.subjects[subject].id,
                studentId: parseInt(user.id),
                price: 250 * block.totalHours,
            };

            fetch('http://localhost:8080/api/reservation/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...reservation,
                }),
            }).then(res => {
                if (res.status !== 200) {
                    setAlertSeverity('error');
                    setAlertMessage('There was an error making the reservation!');
                } else {
                    router.push('/student-landing');
                }
                setAlert(true);
            });
        });
        handleCancel();

        setAlertSeverity('success');
        setAlertMessage('Reservation has been made successfully!');
    };

    const handleSubjectChange = e => {
        setSelectedBlocks([]);
        setSubject(e.target.value);
    };

    const handleConfirmationOpen = () => {
        let orderedSelectedBlocks = order_and_group(selectedBlocks);
        setOrderedSelectedBlocks(orderedSelectedBlocks);
        setShowConfirmationReservation(true);
    };

    return (
        <>
            <div style={{ display: 'flex', width: '90%', margin: '2rem auto', alignItems: 'end', justifyContent: 'space-between' }}>
                <HorizontalProfessorCard professor={professor} />

                <FormControl sx={{ minWidth: 150, backgroundColor: '#fff' }}>
                    <InputLabel>Subject</InputLabel>
                    <Select value={subject} label='Subject' onChange={e => handleSubjectChange(e)}>
                        {professor.subjects?.map((subject, idx) => (
                            <MenuItem value={idx} key={subject.id}>
                                {subject.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </div>

            <div style={{ width: '90%', margin: 'auto' }}>
                <CalendarPagination week={week} setWeek={setWeek} setSelectedBlocks={setSelectedBlocks} />
                <Calendar
                    selectedBlocks={selectedBlocks}
                    setSelectedBlocks={setSelectedBlocks}
                    disabledBlocks={disabledBlocks}
                    week={week}
                />
            </div>

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
                            {orderedSelectedBlocks.map((block, idx) => (
                                <Typography key={idx}>{block.day + ' ' + block.startingHour + ' - ' + block.endingHour}</Typography>
                            ))}
                        </div>
                        <Divider orientation='vertical' flexItem />
                        <div style={{ paddingInline: '2rem' }}>
                            <Typography>{`Subject: ${professor.subjects[subject]?.name}`}</Typography>
                            <Typography>{`Price per hour: 500`}</Typography>
                            <Typography>{`Total: $${(500 * selectedBlocks.length) / 2}`}</Typography>
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

            <Snackbar
                open={alert}
                autoHideDuration={3000}
                onClose={() => setAlert(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'top' }}
            >
                <Alert severity={alertSeverity}>{alertMessage}</Alert>
            </Snackbar>
        </>
    );
}
