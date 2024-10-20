// Mui
import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    FormControl,
    InputLabel,
    MenuItem,
    Modal,
    Select,
    Snackbar,
    Typography,
} from '@mui/material';

// Hooks
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

// Components
import Calendar from '@/components/Calendar';
import HorizontalProfessorCard from './components/HorizontalProfessorCard';

// Utils
import { order_and_group } from '@/utils/order_and_group';
import { useUser } from '@/context/UserContext';
import CalendarPagination from '@/components/CalendarPagination';
import Upload from '@/components/Upload';
import LoadingModal from '@/components/modals/LoadingModal';
import useSWR from 'swr';
import { fetcherGetWithToken } from '@/helpers/FetchHelpers';
import useWindowSize from '@/hooks/useWindowSize';
import { useProfessor } from '@/context/ProfessorContext';
import Layout from '@/components/ui/Layout';

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
    const [subject, setSubject] = useState(0);
    const [showConfirmReservation, setShowConfirmationReservation] = useState(false);
    const [week, setWeek] = useState(0);
    const user = useUser();
    const [alert, setAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertSeverity, setAlertSeverity] = useState('');
    const [isProcessingReservation, setIsProcessingReservation] = useState(false);
    const [disabledBlocks, setDisabledBlocks] = useState([]);
    const [day, setDay] = useState(1);
    const [price, setPrice] = useState(null);
    const windowSize = useWindowSize();
    const { professorId } = useProfessor();

    var curr = new Date();
    var first = curr.getDate() - curr.getDay();

    const { data: professor, isLoading } = useSWR(
        [`${process.env.NEXT_PUBLIC_API_URI}/api/professor/${professorId}`, user.token],
        fetcherGetWithToken,
        { fallbackData: { subjects: [] } }
    );

    const { data: professorSubjects } = useSWR(
        [`${process.env.NEXT_PUBLIC_API_URI}/api/professor-subject/findByProfessor/${professorId}`, user.token],
        fetcherGetWithToken,
        { fallbackData: [] }
    );

    useEffect(() => {
        if (router.isReady && user.id) {
            const requestOptions = {
                method: 'GET',
                headers: { Authorization: `Bearer ${user.token}` },
            };
            fetch(`${process.env.NEXT_PUBLIC_API_URI}/api/reservation/findByAppUserId?appUserId=${professorId}`, requestOptions).then(
                res => {
                    res.json().then(json => {
                        setDisabledBlocks(
                            json.map(e => {
                                e['day'] = e.date;
                                if (e.date[1] < 10) e.day[1] = '0' + e.date[1];
                                if (e.date[2] < 10) e.day[2] = '0' + e.date[2];
                                if (e.startingHour[0] < 10) e.startingHour[0] = '0' + e.startingHour[0];
                                if (e.startingHour[1] < 10) e.startingHour[1] = '0' + e.startingHour[1];
                                if (e.endingHour[0] < 10) e.endingHour[0] = '0' + e.endingHour[0];
                                if (e.endingHour[1] < 10) e.endingHour[1] = '0' + e.endingHour[1];

                                return e;
                            })
                        );
                    });
                }
            );
        }
    }, [user, router]);

    const handleCancel = () => {
        setSelectedBlocks([]);
        setShowConfirmationReservation(false);
    };

    const handleGoogleAuth = () => {
        return new Promise((resolve, reject) => {
            let windowClosedProgrammatically = false; // Flag to track if window was closed programmatically

            fetch(`${process.env.NEXT_PUBLIC_API_URI}/authorize`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            })
                .then(response => response.text()) // Get the URL as text
                .then(authorizationUrl => {
                    console.log('Authorization URL:', authorizationUrl);
                    if (authorizationUrl.startsWith('http')) {
                        // Open the Google OAuth page in a new window
                        const googleAuthWindow = window.open(authorizationUrl, 'Google OAuth');

                        // Poll for the authorization code in localStorage
                        const authInterval = setInterval(() => {
                            const googleAuthCode = localStorage.getItem('googleAccessToken');
                            if (googleAuthCode) {
                                clearInterval(authInterval); // Stop polling
                                windowClosedProgrammatically = true; // Mark window as closed programmatically
                                googleAuthWindow.close(); // Close the popup window
                                setAlertSeverity('success');
                                setAlertMessage('Google Calendar access granted! You can now create reservations.');
                                resolve(googleAuthCode); // Resolve when token is available
                            }

                            // Check if the window has been closed manually by the user
                            if (!windowClosedProgrammatically && googleAuthWindow.closed) {
                                clearInterval(authInterval); // Stop polling
                                setIsProcessingReservation(false);
                                setShowConfirmationReservation(false);
                                setAlert(true);
                                reject(new Error('Google OAuth window was closed before authorization.'));
                                setAlertSeverity('error');
                                setAlertMessage('Google Calendar authorization was not completed. Please try again.');
                            }
                        }, 1000); // Poll every second

                        // Set a timeout for the whole authorization process (e.g., 2 minutes)
                        setTimeout(() => {
                            if (!localStorage.getItem('googleAccessToken')) {
                                clearInterval(authInterval); // Stop polling
                                if (!windowClosedProgrammatically && !googleAuthWindow.closed) {
                                    googleAuthWindow.close(); // Close the popup window if still open
                                }
                                reject(new Error('Google OAuth authorization timed out.'));
                                setAlertSeverity('error');
                                setAlertMessage('Google Calendar authorization timed out. Please try again.');
                            }
                        }, 2 * 60 * 1000); // 2 minutes timeout
                    } else {
                        console.error('Error retrieving authorization URL.');
                        reject(new Error('Authorization URL is invalid.'));
                    }
                })
                .catch(err => {
                    console.error('Error authorizing with Google:', err);
                    setAlertSeverity('error');
                    setAlertMessage('Error with Google Calendar authorization!');
                    reject(err); // Reject promise on error
                });
        });
    };

    const handleReserve = async () => {
        setIsProcessingReservation(true);
        let googleAccessToken = localStorage.getItem('googleAccessToken'); // Retrieve the access token, not the authorization code

        if (!googleAccessToken) {
            try {
                googleAccessToken = await handleGoogleAuth(); // Wait for Google Auth to complete
            } catch (error) {
                setIsProcessingReservation(false);
                console.error('Google Auth failed:', error);
                return; // Stop reservation process if Google Auth fails
            }
        }

        orderedSelectedBlocks.forEach(block => {
            let date = new Date(curr.setDate(first + dayNumber[block.day] + 7 * week));
            const year = date.toLocaleString('default', { year: 'numeric' });
            const month = date.toLocaleString('default', { month: '2-digit' });
            const day = date.toLocaleString('default', { day: '2-digit' });

            date = [year, month, day].join('-');

            console.log(block.totalHours);

            const reservation = {
                day: date,
                startingHour: block.startingHour,
                endingHour: block.endingHour,
                duration: block.totalHours,
                professorId: professor.id,
                subjectId: professor.subjects[subject].id,
                studentId: parseInt(user.id),
                totalHours: block.totalHours,
            };

            // Send the reservation and the access token to the backend
            fetch(`${process.env.NEXT_PUBLIC_API_URI}/api/reservation/create?accessToken=${googleAccessToken}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`,
                },
                body: JSON.stringify(reservation),
            })
                .then(res => {
                    if (res.status !== 200) {
                        setAlertSeverity('error');
                        setAlertMessage('There was an error making the reservation!');
                    } else {
                        setAlertSeverity('success');
                        setAlertMessage('Reservation created successfully and Google Calendar event added!');
                        router.push('/student-landing'); // Redirect after successful reservation
                    }
                    setAlert(true);
                })
                .catch(err => {
                    setIsProcessingReservation(false);
                    console.error('Error creating reservation:', err);
                    setAlertSeverity('error');
                    setAlertMessage('Error creating reservation!');
                    setAlert(true);
                })
                .finally(() => setIsProcessingReservation(false));
        });
    };

    const handleSubjectChange = e => {
        setSelectedBlocks([]);
        setSubject(e.target.value);
    };

    const handleConfirmationOpen = () => {
        console.log('professor:', professor);
        console.log('professorSubjects:', professorSubjects);

        // Ensure 'subject' is defined and valid
        if (typeof subject === 'undefined' || !professor.subjects[subject]) {
            console.error('Subject is undefined or invalid');
            return;
        }

        // Correctly compare the subject IDs
        var professorSubject = professorSubjects.find(subject_item => subject_item.subject.id === professor.subjects[subject].id);

        // Check if professorSubject was found
        if (!professorSubject) {
            console.error('Professor subject not found');
            return;
        }

        if (professorSubject.price === null) {
            setPrice(professor.subjects[subject].price);
        } else {
            setPrice(professorSubject.price);
        }

        let orderedSelectedBlocks = order_and_group(selectedBlocks);
        setOrderedSelectedBlocks(orderedSelectedBlocks);
        setShowConfirmationReservation(true);
    };

    return (
        <Layout>
            {isLoading ? ( // Show loader while fetching data
                <Box display='flex' justifyContent='center' alignItems='center' height='80vh'>
                    <CircularProgress />
                </Box>
            ) : (
                <>
                    {windowSize.width > 500 && (
                        <div
                            style={{
                                display: 'flex',
                                width: '90%',
                                margin: '2rem auto',
                                alignItems: 'end',
                                justifyContent: 'space-between',
                            }}
                        >
                            <HorizontalProfessorCard professor={professor} />
                            <FormControl sx={{ minWidth: 150, backgroundColor: '#fff', ml: 5 }}>
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
                    )}
                    {windowSize.width <= 500 && (
                        <>
                            <HorizontalProfessorCard professor={professor} />
                            <FormControl sx={{ backgroundColor: '#fff', marginBlock: '1.5rem' }} fullWidth>
                                <InputLabel>Subject</InputLabel>
                                <Select value={subject} label='Subject' onChange={e => handleSubjectChange(e)}>
                                    {professor.subjects?.map((subject, idx) => (
                                        <MenuItem value={idx} key={subject.id}>
                                            {subject.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </>
                    )}
                    <div style={{ width: '90%', margin: 'auto' }}>
                        <Typography variant='h5' textAlign='center'>
                            Agenda
                        </Typography>
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
                                            <Typography>Selected time</Typography>
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

                            {windowSize.width > 500 && (
                                <CalendarPagination week={week} setWeek={setWeek} setSelectedBlocks={setSelectedBlocks} />
                            )}
                        </div>
                        {windowSize.width <= 500 && (
                            <CalendarPagination
                                week={week}
                                setWeek={setWeek}
                                day={day}
                                setDay={setDay}
                                setSelectedBlocks={setSelectedBlocks}
                            />
                        )}

                        <Calendar
                            selectedBlocks={selectedBlocks}
                            setSelectedBlocks={setSelectedBlocks}
                            disabledBlocks={disabledBlocks}
                            week={week}
                            day={day}
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
                                {price != null && (
                                    <div style={{ paddingInline: '2rem' }}>
                                        <Typography>{`Subject: ${professor.subjects[subject]?.name}`}</Typography>
                                        <Typography>{`Price per hour: ${price}`}</Typography>
                                        <Typography>{`Total: $${(price * selectedBlocks.length) / 2}`}</Typography>
                                    </div>
                                )}
                            </div>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleCancel}>Cancel</Button>
                            <Button variant='contained' onClick={handleReserve}>
                                Reserve
                            </Button>
                        </DialogActions>
                    </Dialog>

                    <LoadingModal isOpen={isProcessingReservation} message={'Processing reservation, please wait...'} />

                    <Snackbar
                        open={alert}
                        autoHideDuration={3000}
                        onClose={() => setAlert(false)}
                        anchorOrigin={{ vertical: 'top', horizontal: 'top' }}
                    >
                        <Alert severity={alertSeverity}>{alertMessage}</Alert>
                    </Snackbar>
                </>
            )}
        </Layout>
    );
}
