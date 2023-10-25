import { useUser } from '@/context/UserContext';
import {
    Alert,
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    Snackbar,
    TextField,
    Typography,
} from '@mui/material';
import { useState } from 'react';
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

export default function Upload({ id }) {
    const user = useUser();
    const [uploadedInfo, setUploadedInfo] = useState(null);
    const [alert, setAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertSeverity, setAlertSeverity] = useState('');
    const [open, setOpen] = useState(false);
    const [newMessage, setNewMessage] = useState('');

    const VisuallyHiddenInput = styled('input')({
        clip: 'rect(0 0 0 0)',
        clipPath: 'inset(50%)',
        height: 1,
        overflow: 'hidden',
        position: 'absolute',
        bottom: 0,
        left: 0,
        whiteSpace: 'nowrap',
        width: 1,
    });

    const onFileChange = event => {
        const myFile = event.target.files[0];
        setUploadedInfo(myFile);
    };

    const handleSave = () => {
        if (uploadedInfo !== null) {
            fetch(`${process.env.NEXT_PUBLIC_API_URI}/api/file/uploadFile`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${user.token}`,
                },
                body: uploadedInfo,
            }).then(res => {
                if (res.ok === 200) {
                    setAlertMessage('File uploaded successfully!');
                } else {
                    setAlertSeverity('error');
                    setAlertMessage('There was an error uploading the file!');
                }
            });
        }
        if (newMessage !== '') {
            fetch(`${process.env.NEXT_PUBLIC_API_URI}/api/comment/upload`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`,
                },
                body: JSON.stringify({
                    text: newMessage,
                    classReservation: parseInt(id),
                    role: user.role.toUpperCase(),
                    uploadedDateTime: new Date().toISOString().split('T')[0] + ' ' + new Date().toISOString().split('T')[1].split('.')[0],
                    associatedId: user.id,
                }),
            }).then(res => {
                if (res.ok === 200) {
                    setAlertMessage('Message uploaded successfully!');
                } else {
                    setAlertSeverity('error');
                    setAlertMessage('There was an error uploading the message!');
                }
            });
        }
        setOpen(false);
        setAlert(true);
        setNewMessage('');
        setUploadedInfo(null);
    };

    const handleClose = () => {
        setOpen(false);
        setNewMessage('');
        setUploadedInfo(null);
    };

    return (
        <div>
            <Button variant='contained' onClick={() => setOpen(true)}>
                Upload
            </Button>

            <Snackbar
                open={alert}
                autoHideDuration={3000}
                onClose={() => setAlert(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'top' }}
            >
                <Alert severity={alertSeverity}>{alertMessage}</Alert>
            </Snackbar>

            <Dialog open={open} onClose={handleClose} fullWidth>
                <DialogTitle>Upload</DialogTitle>

                <DialogContent dividers sx={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{ paddingInline: '2rem' }}>
                        <TextField
                            fullWidth
                            value={newMessage}
                            label='Message'
                            onChange={event => {
                                setNewMessage(event.target.value);
                            }}
                        />
                    </div>
                    <Divider orientation='vertical' flexItem />
                    <div style={{ paddingInline: '2rem' }}>
                        <Button component='label' variant='contained' startIcon={<CloudUploadIcon />}>
                            Upload file
                            <VisuallyHiddenInput type='file' onChange={onFileChange} />
                        </Button>
                        <Typography>{uploadedInfo?.name}</Typography>
                    </div>
                </DialogContent>

                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button variant='contained' onClick={handleSave}>
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
