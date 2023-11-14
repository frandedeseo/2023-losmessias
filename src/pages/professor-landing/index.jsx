import Calendar from '@/components/Calendar';
import CalendarPagination from '@/components/CalendarPagination';
import Dashboard from '@/components/Dashboard';
import { useUser } from '@/context/UserContext';
import { order_and_group } from '@/utils/order_and_group';
import { Alert, Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Snackbar, Tab, TableCell, TableRow, Tabs, Typography } from '@mui/material';
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
    const [alertSeverity, setAlertSeverity] = useState('error');
    const [disabledBlocks, setDisabledBlocks] = useState([]);
    const user = useUser();
    const [userName, setUserName] = useState('');
    const [tab, setTab] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    var curr = new Date();
    var first = curr.getDate() - curr.getDay();

    useEffect(() => {
        setIsLoading(true);
        if (router.isReady && user.id) {
            if (user.authenticated){
                if (user.role == 'student') {
                    router.push('/student-landing');
                } else if (user.role === 'admin') {
                    router.push('/admin-landing');
                } else {
                    const requestOptions = {
                        method: 'GET',
                        headers: { Authorization: `Bearer ${user.token}` },
                    };
                    fetch(`${process.env.NEXT_PUBLIC_API_URI}/api/reservation/findByProfessor?professorId=${user.id}`, requestOptions).then(res => {
                        if (res.status === 200)
                            res.json().then(json => {
                                setDisabledBlocks(
                                    json.map(e => {
                                        if (e.day[2] < 10) e.day[2] = '0' + e.day[2];
                                        return e;
                                    })
                                );
                                setIsLoading(false);
                            });
                    });
                    fetch(`${process.env.NEXT_PUBLIC_API_URI}/api/professor/${user.id}`, requestOptions).then(res => {
                        if (res.status === 200)
                            return res.json().then(json => {
                                setUserName(json.firstName + ' ' + json.lastName);
                            });
                        else return [];
                    });
                }
            }
            else {
                router.push('/');
            }
        }
    }, [user, router.isReady]);

    const handleCancel = () => {
        setSelectedBlocks([]);
        setShowConfirmationDisable(false);
    };

    const handleConfirmationOpen = () => {
        let orderedSelectedBlocks = order_and_group(selectedBlocks);
        setOrderedSelectedBlocks(orderedSelectedBlocks);
        setShowConfirmationDisable(true);
    };

    const handleTabChange = (event, newValue) => {
        setTab(newValue);
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

            fetch(`${process.env.NEXT_PUBLIC_API_URI}/api/reservation/createUnavailable`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`,
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
        <>
        {isLoading ? (
            <>
                <Box
                    sx={{
                        height: 300,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <CircularProgress />
                </Box>
            </>
        ) : (
        <div style={{ width: '95%', margin: 'auto' }}>
            <Typography variant='h4' sx={{ margin: '2% 0' }}>
                Hi{' ' + user.firstName + ' ' + user.lastName}, welcome back!
            </Typography>

            <Tabs value={tab} onChange={handleTabChange}>
                <Tab label='Agenda' />
                <Tab label='Dashboard' />
            </Tabs>
            <div style={{ paddingBlock: '0.75rem' }} />
            {tab === 0 && (
                <>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <table style={{ height: '35px' }}>
                            <tbody>
                                <tr>
                                    <td
                                        style={{
                                            width: '130px',
                                            borderBlock: '1px solid #338aed70',
                                            backgroundColor: '#338aed90',
                                            textAlign: 'center',
                                        }}
                                    >
                                        <Typography>Selected block</Typography>
                                    </td>
                                    <td
                                        style={{
                                            textAlign: 'center',
                                            width: '130px',
                                            borderBlock: '1px solid #e64b4b70',
                                            backgroundColor: '#e64b4b90',
                                        }}
                                    >
                                        <Typography>Reserved Class</Typography>
                                    </td>
                                    <td
                                        style={{
                                            textAlign: 'center',
                                            width: '130px',
                                            borderBlock: '1px solid #adadad70',
                                            backgroundColor: '#adadad90',
                                        }}
                                    >
                                        <Typography>Unavailable</Typography>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <CalendarPagination week={week} setWeek={setWeek} setSelectedBlocks={setSelectedBlocks} />
                    </div>
                    <Calendar
                        selectedBlocks={selectedBlocks}
                        setSelectedBlocks={setSelectedBlocks}
                        disabledBlocks={disabledBlocks}
                        week={week}
                        showData
                    />

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
                        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                    >
                        <Alert severity={alertSeverity}>{alertMessage}</Alert>
                    </Snackbar>
                </>
            )}
            {tab === 1 && <Dashboard id={user.id} />}
        </div>
        )}
        </>
    );
}
