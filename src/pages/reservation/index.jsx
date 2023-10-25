import { useRouter } from 'next/router';
import HorizontalProfessorCard from '../reservations/components/HorizontalProfessorCard';
import Upload from '@/components/Upload';
import { useEffect, useState } from 'react';
import { useUser } from '@/context/UserContext';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    Typography,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

export default function Reservation() {
    const router = useRouter();
    const [userInfo, setUserInfo] = useState({});
    const [comments, setComments] = useState([]);
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [files, setFiles] = useState([]);
    const user = useUser();

    useEffect(() => {
        if (user.id) {
            const requestOptions = {
                method: 'GET',
                headers: { Authorization: `Bearer ${user.token}` },
            };

            fetch(`${process.env.NEXT_PUBLIC_API_URI}/api/file/get-uploaded-data?id=${router.query.id}`, requestOptions).then(res => {
                res.json().then(json => {
                    setFiles(json);
                });
            });

            if (user.role === 'student') {
                fetch(`${process.env.NEXT_PUBLIC_API_URI}/api/professor/${router.query.userId}`, requestOptions).then(res => {
                    res.json().then(json => {
                        setUserInfo(json);
                    });
                });
            } else {
                fetch(`${process.env.NEXT_PUBLIC_API_URI}/api/student/${router.query.userId}`, requestOptions).then(res => {
                    res.json().then(json => {
                        setUserInfo(json);
                    });
                });
            }
        }
    }, [user]);

    const handleClick = message => {
        setMessage(message);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setMessage('');
    };

    return (
        <div style={{ width: '90%', margin: '2rem auto' }}>
            <div style={{ display: 'flex', alignItems: 'end', justifyContent: 'space-between' }}>
                <HorizontalProfessorCard professor={userInfo} />
                <Upload id={router.query.id} />
            </div>

            <List>
                {comments.map(com => {
                    let author = userInfo;
                    if (com.role === user.role) author = user;

                    return (
                        <ListItemButton onClick={() => handleClick(com.text)}>
                            <ListItemIcon>
                                <SendIcon />
                            </ListItemIcon>
                            <Typography>{author.firstName + ' ' + author.lastName + ' - ' + com.uploadedDateTime}</Typography>
                        </ListItemButton>
                    );
                })}
            </List>

            <Dialog open={open} onClose={handleClose} fullWidth>
                <DialogTitle>Message</DialogTitle>

                <DialogContent>
                    <Typography>{message}</Typography>
                </DialogContent>

                <DialogActions>
                    <Button onClick={handleClose}>Close</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
