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
    const [open, setOpen] = useState();
    const [isProcessingReservation, setIsProcessingReservation] = useState(false);

    var curr = new Date();
    var first = curr.getDate() - curr.getDay();

    const { data: professor, isLoading } = useSWR(
        [`${process.env.NEXT_PUBLIC_API_URI}/api/professor/${router.query.professorId}`, user.token],
        fetcherGetWithToken,
        { fallbackData: { subjects: [] } });

    const { data: disabledBlocks, isLoading: isLoadingDissabledBlocks } = useSWR(
        [`${process.env.NEXT_PUBLIC_API_URI}/api/reservation/findByProfessor?professorId=${router.query.professorId}`, user.token],
        fetcherGetWithToken,
        { fallbackData: [] });

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
            setIsProcessingReservation(true);
            fetch(`${process.env.NEXT_PUBLIC_API_URI}/api/reservation/create`, {
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
                    setAlertMessage('There was an error making the reservation!');
                } else {
                    router.push('/student-landing');
                }
                setAlert(true);
            }).finally(() => setIsProcessingReservation(false));
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
                <Button onClick={() => setOpen(!open)}>Upload a file</Button>

                <Modal open={open} onClose={() => setOpen(false)} sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                    <Upload />
                </Modal>
            </div>
            <div style={{ width: '90%', margin: 'auto' }}>
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

                    <CalendarPagination week={week} setWeek={setWeek} setSelectedBlocks={setSelectedBlocks} />
                </div>

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
    );
}
