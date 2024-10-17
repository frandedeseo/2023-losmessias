// components/ClassCard.js

import {
    Alert,
    Button,
    Card,
    CardActionArea,
    CardActions,
    CardContent,
    Dialog,
    DialogActions,
    DialogContentText,
    DialogTitle,
    List,
    ListItem,
    ListItemIcon,
    Typography,
} from '@mui/material';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PersonIcon from '@mui/icons-material/Person';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useUser } from '@/context/UserContext';
import { useReservation } from '@/context/ReservationContext';
import { getColor } from '@/utils/getColor';

function parseTime(reservation) {
    let start = reservation.startingHour.join(':');
    let end = reservation.endingHour.join(':');
    if (reservation.endingHour[1] === 0) end += '0';
    if (reservation.startingHour[1] === 0) start += '0';

    return start + ' - ' + end;
}

function check_cancellation_late(reservation, curr_date) {
    if (
        parseInt(reservation.date[2]) >= parseInt(curr_date[2]) - 2 &&
        parseInt(reservation.date[1]) === parseInt(curr_date[1]) &&
        parseInt(reservation.date[0]) === parseInt(curr_date[0])
    )
        return true;

    return false;
}

function check_cancellation_valid(reservation, curr_date) {
    if (
        parseInt(reservation.date[2]) < parseInt(curr_date[2]) &&
        parseInt(reservation.date[1]) === parseInt(curr_date[1]) &&
        parseInt(reservation.date[0]) === parseInt(curr_date[0])
    )
        return false;
    else if (parseInt(reservation.date[1]) < parseInt(curr_date[1]) && parseInt(reservation.date[0]) === parseInt(curr_date[0]))
        return true;
    else if (parseInt(reservation.date[0]) < parseInt(curr_date[0])) return true;

    return true;
}

export default function ClassCard({ reservation, style, cancel }) {
    const user = useUser();
    const { setReservationId, setUserId } = useReservation();
    const router = useRouter();
    const [showConfirmCancel, setShowConfirmCancel] = useState(false);
    const userId = user.role === 'student' ? reservation.professor : reservation.student;
    const userIdValue = userId.id;
    const curr_date = new Date().toISOString().split('T')[0].split('-');

    const handleCardClick = () => {
        setReservationId(reservation.id);
        setUserId(userIdValue);
        router.push('/reservation'); // Navigate without query parameters
    };

    const handleAbort = () => {
        setShowConfirmCancel(false);
    };

    const handleCancel = () => {
        cancel(reservation.id);
        setShowConfirmCancel(false);
    };

    return (
        <>
            <Card sx={{ maxWidth: 350, ...style }}>
                <CardActionArea onClick={handleCardClick}>
                    <div style={{ height: 20, backgroundColor: getColor(reservation.subject.name) }} />
                    <CardContent>
                        <ListItem>
                            <ListItemIcon>
                                <BookmarkIcon sx={{ color: getColor(reservation.subject.name) }} />
                            </ListItemIcon>
                            <Typography variant='body1' color='text.secondary'>
                                {reservation.subject.name}
                            </Typography>
                        </ListItem>
                        <List>
                            <ListItem>
                                <ListItemIcon>
                                    <PersonIcon />
                                </ListItemIcon>
                                <Typography variant='body1' color='text.secondary'>
                                    {userId.firstName + ' ' + userId.lastName}
                                </Typography>
                            </ListItem>
                            <ListItem>
                                <ListItemIcon>
                                    <CalendarTodayIcon />
                                </ListItemIcon>
                                <Typography variant='body1' color='text.secondary'>
                                    {reservation.date.join('/')}
                                </Typography>
                            </ListItem>
                            <ListItem>
                                <ListItemIcon>
                                    <AccessTimeIcon />
                                </ListItemIcon>
                                <Typography variant='body1' color='text.secondary'>
                                    {parseTime(reservation)}
                                </Typography>
                            </ListItem>
                        </List>
                    </CardContent>
                </CardActionArea>
                <CardActions>
                    <ListItem sx={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                        <Button
                            variant='contained'
                            color='error'
                            onClick={() => setShowConfirmCancel(true)}
                            disabled={!check_cancellation_valid(reservation, curr_date)}
                        >
                            Cancel
                        </Button>
                    </ListItem>
                </CardActions>
            </Card>

            <Dialog open={showConfirmCancel}>
                <DialogTitle>Confirm Cancellation</DialogTitle>

                {check_cancellation_late(reservation, curr_date) && (
                    <DialogContentText sx={{ padding: '1rem' }}>
                        <Typography>
                            You are cancelling the reservation less than 48 hours before. 50% of the price will be charged.
                        </Typography>
                    </DialogContentText>
                )}
                <DialogActions>
                    <Button onClick={handleAbort} color='error'>
                        Abort
                    </Button>
                    <Button variant='contained' onClick={handleCancel} color='error'>
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
