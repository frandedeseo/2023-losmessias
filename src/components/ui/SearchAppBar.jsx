import { Menu as MenuIcon } from '@mui/icons-material';
import { AppBar, Badge, Box, Grid, IconButton, List, ListItem, ListItemText, TextField, Toolbar, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import TemporaryDrawer from './TemporaryDrawer';
import { useUser } from '@/context/UserContext';
import MailIcon from '@mui/icons-material/Mail';

export default function SearchAppBar() {

    const [menuIsOpen, setMenuIsOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [notificationNotOpenedLength, setNotificationsNotOpenedLength] = useState(0);
    const [open, setOpen] = useState(false);
    const user = useUser();

    const style = {
        width: '100%',
        maxWidth: 360,
        bgcolor: 'background.paper',
        position: 'absolute',
        top: 60,
        right: 5,
        zIndex: 1000
      };

    const handleClose = () => {
        if (open==true && notificationNotOpenedLength!=0){
            setNotificationsNotOpenedLength(0);
            const newNotifications = notifications.map((n) => {
                n.opened=true;
                return n;
            });
            notifications.map((n) => {
                fetch(`http://localhost:8080/api/notification/open-student-notification?id=${n.id}`, {
                    method: 'POST',
                    headers: {
                        Authorization : `Bearer ${user.token}`,
                    }
                })
            });
            console.log(newNotifications);
            setNotifications(newNotifications);

        }
        setOpen(!open)
    }

    useEffect(() => {
        if (user.id != null){
            console.log(user.id);
            fetch(`http://localhost:8080/api/notification/student-all?id=${user.id}`)
            .then(response => response.json())
            .then(json => {
                const data = json.reverse().slice(0,10);
                console.log(data);
                setNotifications(data);
                const unseenNotif = data.filter((element) => element.opened==false);
                setNotificationsNotOpenedLength(unseenNotif.length);
            })
            .catch(error => {
                console.log(error);
            });
        }
    }, [user]);

    const displayNotification = ({ id, message, opened, student }) => {
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
    

    const toggleDrawer = () => {
        setMenuIsOpen(!menuIsOpen);
    };

    if (user.authenticated) {
        return (
            <Box sx={{ flexGrow: 1 }}>
                <AppBar position='static'>
                    <Toolbar>
                        <IconButton
                            size='large'
                            edge='start'
                            color='inherit'
                            aria-label='open drawer'
                            sx={{ mr: 2 }}
                            onClick={toggleDrawer}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography variant='h4' noWrap component='div' sx={{ flexGrow: 1 }}>
                            Leherer
                        </Typography>
                        <Badge badgeContent={notificationNotOpenedLength} color="secondary">
                            <MailIcon color="white" fontSize="large" onClick={() => handleClose()}/>
                        </Badge>
                        {open && (
                            <List sx={style} component="nav" >
                                {notifications.map((n) => displayNotification(n))}
                            </List>
                        )}
                    </Toolbar>
                    
                            
                    
                </AppBar>
                <TemporaryDrawer toggleDrawer={toggleDrawer} menuIsOpen={menuIsOpen} />
            </Box>
        );
    }
}
