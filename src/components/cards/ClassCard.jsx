// Mui
import {
    Alert,
    Button,
    Card,
    CardActionArea,
    CardActions,
    CardContent,
    Dialog,
    DialogActions,
    DialogTitle,
    List,
    ListItem,
    ListItemIcon,
    Snackbar,
    Typography,
} from '@mui/material';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PersonIcon from '@mui/icons-material/Person';

// Components
import Link from 'next/link';

/// Hooks
import { getColor } from '@/utils/getColor';
import { useState } from 'react';
import { useUser } from '@/context/UserContext';

function parseTime(reservation) {
    let start = reservation.startingHour.join(':');
    let end = reservation.endingHour.join(':');
    if (reservation.endingHour[1] === 0) end += '0';
    if (reservation.startingHour[1] === 0) start += '0';

    return start + ' - ' + end;
}

export default function ClassCard({ reservation, style, cancel }) {
    const user = useUser();
    const [showConfirmCancel, setShowConfirmCancel] = useState(false);

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
                <CardActionArea>
                    <Link
                        href={{
                            pathname: '/class',
                            query: { id: reservation.id },
                        }}
                        style={{ textDecoration: 'none' }}
                    >
                        <div style={{ height: 140, backgroundColor: 'red' }} />
                        <CardContent>
                            <ListItem>
                                <ListItemIcon>
                                    <BookmarkIcon />
                                </ListItemIcon>
                                <Typography variant='body1' color='text.secondary'>
                                    {reservation.subject}
                                </Typography>
                            </ListItem>
                            <List>
                                <ListItem>
                                    <ListItemIcon>
                                        <PersonIcon />
                                    </ListItemIcon>
                                    <Typography variant='body1' color='text.secondary'>
                                        {reservation.professor}
                                    </Typography>
                                </ListItem>
                                <ListItem>
                                    <ListItemIcon>
                                        <CalendarTodayIcon />
                                    </ListItemIcon>
                                    <Typography variant='body1' color='text.secondary'>
                                        {reservation.day.join('/')}
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
                    </Link>
                </CardActionArea>
                <CardActions>
                    <ListItem sx={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                        <Button variant='contained' color='error' onClick={() => setShowConfirmCancel(true)}>
                            Cancel
                        </Button>
                    </ListItem>
                </CardActions>
            </Card>

            <Dialog open={showConfirmCancel}>
                <DialogTitle>Confirm Cancelation</DialogTitle>
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
