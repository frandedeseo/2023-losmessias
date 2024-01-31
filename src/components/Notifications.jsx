import { useUser } from '@/context/UserContext';
import MailIcon from '@mui/icons-material/Mail';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { List, ListItem, ListItemText, Badge } from '@mui/material';

export default function Notifications() {
    const [notifications, setNotifications] = useState([]);
    const [notificationNotOpenedLength, setNotificationsNotOpenedLength] = useState(0);
    const [open, setOpen] = useState(false);
    const user = useUser();
    const router = useRouter();

    const style = {
        width: '100%',
        maxWidth: 360,
        bgcolor: 'background.paper',
        position: 'absolute',
        top: 60,
        right: 5,
        zIndex: 1000,
        maxHeight: 600, 
        overflow: 'auto', 
        scrollBehavior: 'smooth'
    };

    const handleClose = () => {
        if (open == true && notificationNotOpenedLength != 0) {
            setNotificationsNotOpenedLength(0);
            const newNotifications = notifications.map((n) => {
                n.opened = true;
                return n;
            });
            notifications.map((n) => {
                fetch(`${process.env.NEXT_PUBLIC_API_URI}/api/notification/open-notification?id=${n.id}`, {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    }
                })
            });
            setNotifications(newNotifications);

        }
        setOpen(!open)
    }

    useEffect(() => {
        if (user.authenticated) {
            fetch(`${process.env.NEXT_PUBLIC_API_URI}/api/notification/all?id=${user.id}`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${user.token}`,
                }
            })
                .then(response => {
                    if(response.status === 200)
                        return response.json()
                    else
                        return [];
                })
                .then(json => {
                    const data = json.reverse().slice(0, 10);
                    setNotifications(data);
                    const unseenNotif = data.filter((element) => element.opened == false);
                    setNotificationsNotOpenedLength(unseenNotif.length);
                })
                .catch(error => {
                    console.log(error);
                });
        }
    }, [user, router]);

    const displayNotification = ({ id, message, opened, user }) => {
        return (
            <>
                {(!opened) && (
                    <ListItem divider style={{ backgroundColor: 'lightgrey' }} >
                        <ListItemText primary={message} style={{ color: 'black' }} />
                    </ListItem>
                )}
                {opened && (
                    <ListItem divider >
                        <ListItemText primary={message} style={{ color: 'black' }} />
                    </ListItem>
                )}
            </>

        );
    };

    return (
        <>
            <Badge badgeContent={notificationNotOpenedLength} color="secondary">
                <MailIcon color="white" fontSize="large" onClick={() => handleClose()} />
            </Badge>
            {open && (
                <List sx={style} component="nav" >
                    {notifications.map((n) => displayNotification(n))}
                </List>
            )}
        </>
    );
}