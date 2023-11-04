import Calendar from '@/components/Calendar';
import CalendarPagination from '@/components/CalendarPagination';
import { useUser } from '@/context/UserContext';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Rating, Tooltip, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';

export default function StudentLandingPage() {
    const [week, setWeek] = useState(0);
    const [disabledBlocks, setDisabledBlocks] = useState([]);
    const [giveFeedback, setGiveFeedback] = useState(true);
    const [feedback, setFeedback] = useState({ rating: 0, time: 0, material: 0, kind: 0 });
    const user = useUser();

    var router = useRouter();

    useEffect(() => {
        if (router.isReady && user.authenticated) {
            if (user.role == 'admin') {
                router.push('/admin-landing');
            } else if (user.role == 'professor') {
                router.push('/professor-landing');
            } else {
                const requestOptions = {
                    method: 'GET',
                    headers: { Authorization: `Bearer ${user.token}` },
                };
                fetch(`${process.env.NEXT_PUBLIC_API_URI}/api/reservation/findByStudent?studentId=${user.id}`, requestOptions).then(res => {
                    res.json().then(json => {
                        setDisabledBlocks(
                            json.map(e => {
                                if (e.day[1] < 10) e.day[1] = '0' + e.day[1];
                                if (e.day[2] < 10) e.day[2] = '0' + e.day[2];
                                if (e.startingHour[0] < 10) e.startingHour[0] = '0' + e.startingHour[0];
                                if (e.startingHour[1] < 10) e.startingHour[1] = '0' + e.startingHour[1];
                                if (e.endingHour[0] < 10) e.endingHour[0] = '0' + e.endingHour[0];
                                if (e.endingHour[1] < 10) e.endingHour[1] = '0' + e.endingHour[1];

                                return e;
                            })
                        );
                    });
                });
            }
        } else {
            router.push('/');
        }
    }, [user]);

    const handleFeedback = () => {
        setGiveFeedback(false);
        console.log('Send feedback');
    };

    const handleFeedbackClick = opt => {
        console.log('hola');
        if (feedback[opt] !== 0) {
            setFeedback(prev => ({ ...prev, [opt]: 0 }));
        } else {
            setFeedback(prev => ({ ...prev, [opt]: 1 }));
        }
    };

    return (
        <div style={{ width: '95%', margin: 'auto' }}>
            <Typography variant='h4' sx={{ margin: '2% 0' }}>
                Hi{' ' + user.firstName + ' ' + user.lastName}, welcome back!
            </Typography>

            <Typography variant='h4'>Agenda</Typography>
            <Divider />
            <div style={{ paddingBlock: '0.75rem' }} />
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
                <CalendarPagination week={week} setWeek={setWeek} setSelectedBlocks={() => {}} />
            </div>
            <Calendar
                selectedBlocks={[]}
                setSelectedBlocks={() => {}}
                disabledBlocks={disabledBlocks}
                week={week}
                interactive={false}
                showData
            />

            <Dialog open={giveFeedback} onClose={() => setGiveFeedback(false)}>
                <DialogTitle>Give Feedback to Francisco de Deseo</DialogTitle>
                <DialogContent>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <Rating
                            precision={0.5}
                            value={feedback.rating}
                            onChange={(event, newValue) => {
                                setFeedback(prev => ({ ...prev, rating: newValue }));
                            }}
                            sx={{ fontSize: 42 }}
                            max={3}
                            size='large'
                        />
                    </div>
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            gap: 10,
                            marginBlock: '1.5rem',
                        }}
                    >
                        <Tooltip title='Is always on time'>
                            <AccessTimeIcon
                                fontSize='large'
                                sx={{ gridColumn: 1 / 3, row: 1, cursor: 'pointer' }}
                                onClick={() => handleFeedbackClick('time')}
                                color={feedback.time === 1 ? 'black' : 'disabled'}
                            />
                        </Tooltip>

                        <Tooltip title='Has extra material to practice'>
                            <InsertDriveFileIcon
                                fontSize='large'
                                sx={{ gridColumn: 1 / 3, row: 1, cursor: 'pointer' }}
                                onClick={() => handleFeedbackClick('material')}
                                color={feedback.material === 1 ? 'black' : 'disabled'}
                            />
                        </Tooltip>

                        <Tooltip title='Is respectful and patient'>
                            <SentimentSatisfiedAltIcon
                                fontSize='large'
                                sx={{ gridColumn: 1 / 3, row: 1, cursor: 'pointer' }}
                                onClick={() => handleFeedbackClick('kind')}
                                color={feedback.kind === 1 ? 'black' : 'disabled'}
                            />
                        </Tooltip>
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setGiveFeedback(false)}>Close</Button>
                    <Button variant='contained' onClick={handleFeedback}>
                        Submit
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
