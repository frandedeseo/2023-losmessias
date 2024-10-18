import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { styled } from '@mui/system';
import {
    Card,
    CardActionArea,
    CardContent,
    CardMedia,
    List,
    ListItem,
    ListItemIcon,
    Typography,
    Box,
    Avatar,
    Button,
    Dialog,
    DialogActions,
    DialogContentText,
    DialogTitle,
    useTheme,
} from '@mui/material';
import {
    Bookmark as BookmarkIcon,
    CalendarToday as CalendarTodayIcon,
    AccessTime as AccessTimeIcon,
    Person as PersonIcon,
} from '@mui/icons-material';
import { useUser } from '@/context/UserContext';
import { useReservation } from '@/context/ReservationContext';
import { getColor } from '@/utils/getColor';

const StyledCard = styled(Card)(({ theme }) => ({
    maxWidth: 350,
    transition: 'transform 0.3s, box-shadow 0.3s',
    '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: '0 8px 16px 0 rgba(0,0,0,0.2)',
    },
}));

const StyledCardMedia = styled(CardMedia)({
    height: 140,
    position: 'relative',
});

const StyledAvatar = styled(Avatar)(({ theme }) => ({
    width: 80,
    height: 80,
    border: '4px solid #e0e0e0',
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
}));

const InfoItem = ({ icon, text }) => (
    <ListItem sx={{ py: 0 }}>
        <ListItemIcon>{icon}</ListItemIcon>
        <Typography variant='body2' color='text.secondary'>
            {text}
        </Typography>
    </ListItem>
);

export default function ClassCard({ reservation, style, cancel }) {
    const user = useUser();
    const { setReservationId, setUserId } = useReservation();
    const router = useRouter();
    const [showConfirmCancel, setShowConfirmCancel] = useState(false);
    const theme = useTheme();

    const userId = user.role === 'student' ? reservation.professor : reservation.student;
    const userIdValue = userId.id;
    const curr_date = new Date().toISOString().split('T')[0].split('-');

    const avatarUrl =
        userId.sex === 'FEMALE'
            ? 'https://cdn1.vectorstock.com/i/1000x1000/38/15/foreign-language-woman-teacher-icon-flat-style-vector-36033815.jpg'
            : 'https://www.w3schools.com/howto/img_avatar.png';

    function parseTime(reservation) {
        let start = reservation.startingHour.join(':');
        let end = reservation.endingHour.join(':');
        if (reservation.endingHour[1] === 0) end += '0';
        if (reservation.startingHour[1] === 0) start += '0';
        return start + ' - ' + end;
    }

    function check_cancellation_late(reservation, curr_date) {
        if (user.role === 'professor') {
            return false;
        }
        const reservationDate = new Date(parseInt(reservation.date[0]), parseInt(reservation.date[1]) - 1, parseInt(reservation.date[2]));
        const currentDate = new Date(parseInt(curr_date[0]), parseInt(curr_date[1]) - 1, parseInt(curr_date[2]));
        const diffTime = reservationDate - currentDate;
        const diffDays = diffTime / (1000 * 60 * 60 * 24);
        return diffDays <= 2;
    }

    function check_cancellation_valid(reservation, curr_date) {
        const reservationDate = new Date(parseInt(reservation.date[0]), parseInt(reservation.date[1]) - 1, parseInt(reservation.date[2]));
        const currentDate = new Date(parseInt(curr_date[0]), parseInt(curr_date[1]) - 1, parseInt(curr_date[2]));
        return reservationDate >= currentDate;
    }

    const handleCardClick = () => {
        setReservationId(reservation.id);
        setUserId(userIdValue);
        router.push('/reservation');
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
            <StyledCard sx={style}>
                <CardActionArea onClick={handleCardClick}>
                    <StyledCardMedia sx={{ backgroundColor: getColor(reservation.subject.name) }}>
                        <StyledAvatar src={avatarUrl} alt={userId.firstName} />
                    </StyledCardMedia>
                    <CardContent sx={{ pt: 0 }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
                            <Typography variant='h6' gutterBottom>
                                {reservation.subject.name}
                            </Typography>
                            <Typography variant='body2' color='text.secondary'>
                                {userId.firstName + ' ' + userId.lastName}
                            </Typography>
                        </Box>
                        <List>
                            <InfoItem icon={<CalendarTodayIcon />} text={reservation.date.join('/')} />
                            <InfoItem icon={<AccessTimeIcon />} text={parseTime(reservation)} />
                        </List>
                    </CardContent>
                </CardActionArea>
                <Box sx={{ p: 2, pt: 0 }}>
                    <Button
                        variant='contained'
                        color='error'
                        fullWidth
                        onClick={() => setShowConfirmCancel(true)}
                        disabled={!check_cancellation_valid(reservation, curr_date)}
                    >
                        Cancel
                    </Button>
                </Box>
            </StyledCard>

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
