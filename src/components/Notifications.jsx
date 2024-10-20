import { useUser } from '@/context/UserContext';
import MailIcon from '@mui/icons-material/Mail';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Badge, Card, CardContent, Typography, Avatar, Box, Button, Stack, IconButton } from '@mui/material';

const DisplayNotification = ({ id, message, opened }) => {
    const cardStyle = {
        backgroundColor: !opened ? '#f5f5f5' : '#ffffff',
        boxShadow: !opened ? '0 4px 6px rgba(0, 0, 0, 0.1)' : 'none',
        marginBottom: '10px',
        borderRadius: '8px',
    };

    const user = useUser();

    return (
        <Card key={id} sx={cardStyle}>
            <CardContent>
                <Stack direction='row' spacing={2} alignItems='center'>
                    <Avatar sx={{ bgcolor: '#1976d2' }}>{user.firstName.charAt(0).toUpperCase()}</Avatar>
                    <Typography variant='body1' color='textPrimary'>
                        {message}
                    </Typography>
                </Stack>
            </CardContent>
        </Card>
    );
};

export default function Notifications() {
    const [notifications, setNotifications] = useState([]);
    const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);
    const [open, setOpen] = useState(false);
    const [visibleCount, setVisibleCount] = useState(10);
    const user = useUser();
    const router = useRouter();

    const handleToggle = () => {
        if (open && unreadNotificationsCount !== 0) {
            setUnreadNotificationsCount(0);

            const newNotifications = notifications.map(n => {
                if (!n.opened) {
                    n.opened = true;
                    // Send request to backend only for unopened notifications
                    fetch(`${process.env.NEXT_PUBLIC_API_URI}/api/notification/open-notification?id=${n.id}`, {
                        method: 'POST',
                        headers: {
                            Authorization: `Bearer ${user.token}`,
                        },
                    });
                }
                return n;
            });

            setNotifications(newNotifications);
        }
        setOpen(!open);
    };

    useEffect(() => {
        if (user.authenticated) {
            fetch(`${process.env.NEXT_PUBLIC_API_URI}/api/notification/all?id=${user.id}`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            })
                .then(response => {
                    if (response.status === 200) return response.json();
                    else return [];
                })
                .then(json => {
                    const data = json.reverse();
                    setNotifications(data);
                    const unseenNotif = data.filter(element => element.opened === false);
                    setUnreadNotificationsCount(unseenNotif.length);
                })
                .catch(error => {
                    console.log(error);
                });
        }
    }, [user, router]);

    return (
        <>
            <IconButton onClick={handleToggle} color='inherit'>
                <Badge badgeContent={unreadNotificationsCount} color='error'>
                    <MailIcon fontSize='large' />
                </Badge>
            </IconButton>
            {open && (
                <Box
                    sx={{
                        position: 'absolute',
                        top: 60,
                        right: 5,
                        width: 360,
                        maxHeight: 600,
                        overflowY: 'auto',
                        bgcolor: 'background.paper',
                        boxShadow: 3,
                        borderRadius: 1,
                        borderColor: 'grey.300',
                        borderRadius: '8px', // Fixed the typo here
                        p: 2,
                        zIndex: 1000,
                    }}
                >
                    {notifications.slice(0, visibleCount).map(n => (
                        <DisplayNotification key={n.id} id={n.id} message={n.message} opened={n.opened} />
                    ))}
                    {visibleCount < notifications.length && (
                        <Button variant='outlined' fullWidth onClick={() => setVisibleCount(visibleCount + 10)} sx={{ mt: 1 }}>
                            Show more
                        </Button>
                    )}
                </Box>
            )}
        </>
    );
}
