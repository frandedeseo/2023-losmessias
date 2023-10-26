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
    Divider,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    Typography,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';

function parse(dateTime) {
    let date = dateTime.slice(0, 3);
    let time = dateTime.slice(3, 7);
    date = date.join('-');
    time = time.join(':');

    return date + ' ' + time;
}

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
                    console.log(json);
                    let comments = [];
                    let files = [];

                    json.forEach(e => {
                        if (e.comment !== undefined) comments.push(e);
                        else files.push(e);
                    });

                    setFiles(files);
                    setComments(comments);
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

    const handleDownload = file => {
        const requestOptions = {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${user.token}`,
            },
        };

        fetch(`${process.env.NEXT_PUBLIC_API_URI}/api/file/downloadFile?id=${file.id}`, requestOptions)
        .then(response => response.blob())
        .then(blob => {
            const url = window.URL.createObjectURL(new Blob([blob]));
            const a = document.createElement('a');
            a.href = url;
            a.download = file.fileName;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        })
        .catch(error => console.error('Error:', error));
    };

    return (
        <div style={{ width: '90%', margin: '2rem auto' }}>
            <div style={{ display: 'flex', alignItems: 'end', justifyContent: 'space-between' }}>
                <HorizontalProfessorCard professor={userInfo} />
                <Upload id={router.query.id} />
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', width: '80%', margin: '2rem auto', justifyContent: 'space-between' }}>
                <List>
                    {comments.map((com, idx) => {
                        let author = userInfo;
                        if (com.role === user.role) author = user;

                        return (
                            <ListItemButton onClick={() => handleClick(com.comment)} key={idx}>
                                <ListItemIcon>
                                    <SendIcon />
                                </ListItemIcon>
                                <Typography>{author.firstName + ' ' + author.lastName + ' - ' + parse(com.uploadedDateTime)}</Typography>
                            </ListItemButton>
                        );
                    })}
                </List>

                <Divider orientation='vertical' flexItem />

                {files.map((file, idx) => (
                    <Button onClick={() => handleDownload(file)} key={idx}>
                        <PictureAsPdfIcon fontSize='large' />
                        <Typography sx={{ marginLeft: '0.5rem' }}>{file.fileName}</Typography>
                    </Button>
                ))}
            </div>

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
