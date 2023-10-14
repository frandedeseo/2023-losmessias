import Calendar from '@/components/Calendar';
import CalendarPagination from '@/components/CalendarPagination';
import { useUser } from '@/context/UserContext';
import { order_and_group } from '@/utils/order_and_group';
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, Snackbar, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

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

export default function ProfessorLandingPage() {
    const router = useRouter();
    const [selectedBlocks, setSelectedBlocks] = useState([]);
    const [orderedSelectedBlocks, setOrderedSelectedBlocks] = useState([]);
    const [week, setWeek] = useState(0);
    const [showConfirmDisable, setShowConfirmationDisable] = useState(false);
    const [alert, setAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertSeverity, setAlertSeverity] = useState('');
    const [disabledBlocks, setDisabledBlocks] = useState([]);
    const user = useUser();
    const [userName, setUserName] = useState('');

    var curr = new Date();
    var first = curr.getDate() - curr.getDay();

    useEffect(() => {
        if (user.id) {
            const requestOptions = {
                method: 'GET',
                headers: { Authorization: `Bearer ${user.token}` }
            };
            fetch(`http://localhost:8080/api/reservation/findByProfessor?professorId=${user.id}`, requestOptions).then(res => {
                console.log(res);
                res.json().then(json => {
                    setDisabledBlocks(
                        json.map(e => {
                            if (e.day[2] < 10) e.day[2] = '0' + e.day[2];
                            return e;
                        })
                    );
                })
            }
            );
            fetch(`http://localhost:8080/api/professor/${user.id}`, requestOptions).then(res =>
                res.json()
                    .then(json => {
                        console.log(json)
                        setUserName(json.firstName + " " + json.lastName)
                    })
            );
        }
    }, [user]);

    const handleCancel = () => {
        setSelectedBlocks([]);
        setShowConfirmationDisable(false);
    };

    const handleConfirmationOpen = () => {
        let orderedSelectedBlocks = order_and_group(selectedBlocks);
        setOrderedSelectedBlocks(orderedSelectedBlocks);
        setShowConfirmationDisable(true);
    };

    const handleDisable = () => {
        orderedSelectedBlocks.forEach(block => {
            const reservation = {
                day: new Date(curr.setDate(first + dayNumber[block.day] + 7 * week)).toISOString().split('T')[0],
                startingHour: block.startingHour,
                endingHour: block.endingHour,
                duration: block.totalHours,
                professorId: parseInt(user.id),
            };

            fetch('http://localhost:8080/api/reservation/createUnavailable', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`
                },
                body: JSON.stringify({
                    ...reservation,
                }),
            }).then(res => {
                if (res.status !== 200) {
                    setAlertSeverity('error');
                    setAlertMessage('There was an error disabling the block!');
                } else {
                    console.log(new Date(curr.setDate(first + dayNumber[block.day] + 7 * week)).toISOString().split('T')[0].split('-'));
                    setDisabledBlocks(prevDisabled => [
                        ...prevDisabled,
                        {
                            day: new Date(curr.setDate(first + dayNumber[block.day] + 7 * week)).toISOString().split('T')[0].split('-'),
                            startingHour: block.startingHour.split(':'),
                            endingHour: block.endingHour.split(':'),
                            status: 'NOT_AVAILABLE',
                        },
                    ]);
                }
                setAlert(true);
            });
        });
        handleCancel();

        setAlertSeverity('success');
        setAlertMessage('Block has been disabled successfully!');
    };

    return (
        <div style={{ width: '95%', margin: 'auto' }}>
            <Typography variant='h4' sx={{ margin: '2% 0' }}>
                Hi {userName}, welcome back!
            </Typography>

            <CalendarPagination week={week} setWeek={setWeek} setSelectedBlocks={setSelectedBlocks} />
            <Calendar selectedBlocks={selectedBlocks} setSelectedBlocks={setSelectedBlocks} disabledBlocks={disabledBlocks} week={week} />

            <div style={{ display: 'flex', justifyContent: 'right', margin: '1rem auto', width: '90%' }}>
                <Button onClick={handleCancel}>Cancel</Button>
                <Button variant='contained' onClick={handleConfirmationOpen} disabled={selectedBlocks.length === 0}>
                    Disable
                </Button>
            </div>

            <Dialog open={showConfirmDisable}>
                <DialogTitle>Confirm Disable</DialogTitle>
                <DialogContent dividers>
                    <div style={{ display: 'flex' }}>
                        <div style={{ paddingInline: '2rem' }}>
                            {orderedSelectedBlocks.map((block, idx) => (
                                <Typography key={idx}>{block.day + ' ' + block.startingHour + ' - ' + block.endingHour}</Typography>
                            ))}
                        </div>
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancel}>Cancel</Button>
                    <Button variant='contained' onClick={handleDisable}>
                        Disable
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
        </div>
    );
}
