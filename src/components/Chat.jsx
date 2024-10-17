import React, { useRef, useState, useEffect } from 'react';
import { Avatar, Box, Button, CircularProgress, Fade, IconButton, Typography, Paper, TextField } from '@mui/material';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import SendIcon from '@mui/icons-material/Send';
import { useUser } from '@/context/UserContext';
import { styled } from '@mui/system';
import { useRouter } from 'next/router';
import { useReservation } from '@/context/ReservationContext';

function parseDateTime(dateTime) {
    const date = new Date(dateTime);
    return date.toLocaleString();
}

const ChatContainer = styled(Paper)({
    display: 'flex',
    flexDirection: 'column',
    height: '600px',
    maxWidth: '800px',
    minWidth: '90%',
    margin: 'auto',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
});

const ChatHeader = styled(Box)({
    backgroundColor: 'white',
    border: '1px solid #e0e0e0',
    color: 'black',
    padding: '16px',
    display: 'flex',
    alignItems: 'center',
});

const ChatArea = styled(Box)({
    flexGrow: 1,
    overflowY: 'auto',
    padding: '16px',
    backgroundColor: '#f5f5f5',
});

const MessageBubble = styled(Paper)(({ isSender }) => ({
    padding: '10px 16px',
    marginBottom: '12px',
    maxWidth: '70%',
    wordWrap: 'break-word',
    backgroundColor: isSender ? '#E3F2FD' : 'white',
    color: isSender ? '#1565C0' : '#333',
    alignSelf: isSender ? 'flex-end' : 'flex-start',
    borderRadius: isSender ? '18px 18px 0 18px' : '18px 18px 18px 0',
    boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
    transition: 'all 0.3s ease',
    '&:hover': {
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        transform: 'translateY(-2px)',
    },
}));

const InputArea = styled(Box)({
    display: 'flex',
    padding: '16px',
    backgroundColor: 'white',
    borderTop: '1px solid #e0e0e0',
});

const StyledTextField = styled(TextField)({
    '& .MuiOutlinedInput-root': {
        borderRadius: '24px',
        backgroundColor: '#f5f5f5',
        transition: 'all 0.3s ease',
        '&:hover': {
            backgroundColor: '#e8e8e8',
        },
        '&.Mui-focused': {
            backgroundColor: 'white',
            boxShadow: '0 0 0 2px #2196F3',
        },
    },
});

const Chat = ({ userInfo }) => {
    const chatContainerRef = useRef(null);
    const fileInputRef = useRef(null);
    const [inputMessage, setInputMessage] = useState('');
    const { reservationId, userId } = useReservation();

    const [messages, setMessages] = useState([]);
    const [fileUploaded, setFileUploaded] = useState(0);
    const user = useUser();
    const router = useRouter();
    const [isLoadingContent, setIsLoadingContent] = useState(true);
    const [isUploading, setIsUploading] = useState(false);

    function parseDateTime(dateTimeArray) {
        // Check if the array has the correct structure and length
        if (!Array.isArray(dateTimeArray) || dateTimeArray.length !== 6) {
            return 'Unknown Date';
        }

        // Convert each element in the array to a number (integer or float)
        const [year, month, day, hour, minute, second] = dateTimeArray.map(value => parseInt(value, 10));

        // Ensure all values are numbers and valid
        if (isNaN(year) || isNaN(month) || isNaN(day) || isNaN(hour) || isNaN(minute) || isNaN(second)) {
            return 'Unknown Date';
        }
        console.log(year, month, day, hour, minute, second);
        // Create a new Date object (remember months are 0-based in JavaScript)
        const date = new Date(year, month - 1, day, hour, minute, second);
        console.log(date);
        // Check if the Date object is valid
        if (isNaN(date.getTime())) {
            console.log(date.getTime());
            return 'Unknown Date';
        }

        return date.toLocaleString(); // Return the formatted date string
    }

    useEffect(() => {
        if (user.id && reservationId && userId) {
            const requestOptions = {
                method: 'GET',
                headers: { Authorization: `Bearer ${user.token}` },
            };
            fetch(`${process.env.NEXT_PUBLIC_API_URI}/api/loadedData/get-uploaded-data?id=${reservationId}`, requestOptions)
                .then(res => res.json())
                .then(json => {
                    // Process json to create messages array
                    console.log(json);
                    let fetchedMessages = json.map(e => {
                        if (e.comment !== undefined) {
                            return {
                                id: e.id,
                                sender: e.role.toLowerCase(),
                                content: e.comment,
                                isFile: false,
                                uploadedDateTime: parseDateTime(e.uploadedDateTime),
                            };
                        } else {
                            return {
                                id: e.id,
                                sender: e.role.toLowerCase(),
                                content: e.fileName,
                                isFile: true,
                                fileId: e.id,
                                fileName: e.fileName,
                                uploadedDateTime: parseDateTime(e.uploadedDateTime),
                            };
                        }
                    });
                    console.log(fetchedMessages);

                    setMessages(fetchedMessages);
                })
                .finally(() => setIsLoadingContent(false));
        }
    }, [user, reservationId, userId, fileUploaded]);

    const handleDownload = message => {
        const requestOptions = {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${user.token}`,
            },
        };

        fetch(`${process.env.NEXT_PUBLIC_API_URI}/api/file/downloadFile?id=${message.id}`, requestOptions)
            .then(response => response.blob())
            .then(blob => {
                const url = window.URL.createObjectURL(new Blob([blob]));
                const a = document.createElement('a');
                a.href = url;
                a.download = message.fileName;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
            })
            .catch(error => console.error('Error:', error));
    };
    const handleDrop = event => {
        event.preventDefault();
        const file = event.dataTransfer.files[0];
        if (file) {
            setIsUploading(true);
            const tempMessageId = Date.now();
            const newMessage = {
                id: tempMessageId,
                sender: user.role.toLowerCase(),
                content: file.name,
                isFile: true,
                fileName: file.name,
                uploadedDateTime: new Date().toLocaleString(),
                uploading: true,
            };
            setMessages([...messages, newMessage]);

            // Upload file to API
            const formData = new FormData();
            formData.append('file', file);
            formData.append('reservationId', reservationId);
            formData.append('role', user.role);

            const requestOptions = {
                method: 'POST',
                headers: { Authorization: `Bearer ${user.token}` },
                body: formData,
            };

            fetch(`${process.env.NEXT_PUBLIC_API_URI}/api/file/uploadFile`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
                body: formData,
            })
                .then(res => res.json())
                .then(json => {
                    // The part where you update messages
                    setMessages(prevMessages =>
                        prevMessages.map(msg => (msg.id === tempMessageId ? { ...msg, id: json.fileId, uploading: false } : msg))
                    );

                    // Ensure the following fetch is executed:
                    return fetch(`${process.env.NEXT_PUBLIC_API_URI}/api/file/setUploadInformation`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${user.token}`,
                        },
                        body: JSON.stringify({
                            idFile: json.fileId,
                            classReservation: parseInt(id),
                            role: user.role.toUpperCase(),
                            uploadedDateTime: getLocalISOTime(),
                            associatedId: user.id,
                        }),
                    });
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Error setting upload information');
                    }
                    return response.json();
                })
                .finally(() => setIsUploading(false)) // End file upload
                .catch(err => {
                    console.error('Error:', err);
                });
        }
    };
    const handleFileUpload = event => {
        const file = event.target.files[0];
        if (file) {
            setIsUploading(true);
            const tempMessageId = Date.now();
            const newMessage = {
                id: tempMessageId,
                sender: user.role.toLowerCase(),
                content: file.name,
                isFile: true,
                fileName: file.name,
                uploadedDateTime: new Date().toLocaleString(),
                uploading: true,
            };
            setMessages([...messages, newMessage]);

            // Upload file to API
            const formData = new FormData();
            formData.append('file', file);
            formData.append('reservationId', reservationId);
            formData.append('role', user.role);

            fetch(`${process.env.NEXT_PUBLIC_API_URI}/api/file/uploadFile`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
                body: formData,
            })
                .then(res => {
                    if (res.status === 200) {
                        // setAlertMessage('File uploaded successfully!');
                        // setAlertSeverity('success');

                        return res.json();
                    } else {
                        // setAlertSeverity('error');
                        // setAlertMessage('There was an error uploading the file!');
                    }
                })
                .then(json => {
                    console.log(json);
                    setMessages(prevMessages =>
                        prevMessages.map(msg => (msg.id === tempMessageId ? { ...msg, id: json.id, uploading: false } : msg))
                    );
                    fetch(`${process.env.NEXT_PUBLIC_API_URI}/api/file/setUploadInformation`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${user.token}`,
                        },
                        body: JSON.stringify({
                            idFile: json.fileId, // Make sure fileId is correctly passed here
                            classReservation: parseInt(reservationId), // Ensure this is a valid number
                            role: user.role.toUpperCase(),
                            uploadedDateTime: getLocalISOTime(),
                            associatedId: user.id, // Make sure this is the correct user ID
                        }),
                    })
                        .then(response => {
                            if (!response.ok) {
                                throw new Error('Error setting upload information');
                            }
                            return response.json();
                        })
                        .then(data => {
                            console.log('Upload information successfully updated:', data);
                            setFileUploaded(fileUploaded + 1);
                        })
                        .finally(() => setIsUploading(false)) // End file upload
                        .catch(err => {
                            console.error('Error setting upload information:', err);
                        });
                })
                .catch(err => {
                    //setAlertSeverity('error');
                    //setAlertMessage('There was an error uploading the file!');
                });
        }
    };

    const getLocalISOTime = () => {
        const currentDateTime = new Date();
        const localISOTime =
            currentDateTime.getFullYear() +
            '-' +
            String(currentDateTime.getMonth() + 1).padStart(2, '0') +
            '-' +
            String(currentDateTime.getDate()).padStart(2, '0') +
            'T' +
            String(currentDateTime.getHours()).padStart(2, '0') +
            ':' +
            String(currentDateTime.getMinutes()).padStart(2, '0') +
            ':' +
            String(currentDateTime.getSeconds()).padStart(2, '0');
        return localISOTime;
    };

    const handleSendMessage = () => {
        if (inputMessage.trim()) {
            const newMessage = {
                id: Date.now(),
                sender: user.role.toLowerCase(),
                content: inputMessage,
                isFile: false,
                uploadedDateTime: new Date().toLocaleString(),
            };
            setIsUploading(true);

            setMessages([...messages, newMessage]);
            setInputMessage('');

            if (newMessage !== '') {
                fetch(`${process.env.NEXT_PUBLIC_API_URI}/api/comment/upload`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${user.token}`,
                    },

                    body: JSON.stringify({
                        text: inputMessage,
                        classReservation: parseInt(reservationId),
                        role: user.role.toUpperCase(),
                        uploadedDateTime: getLocalISOTime(),
                        associatedId: user.id,
                    }),
                }).then(res => {
                    if (res.status === 200) {
                        setIsUploading(false);
                    }
                });
            }
        }
    };
    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages]);
    return (
        <ChatContainer elevation={3}>
            <ChatHeader>
                <Avatar sx={{ bgcolor: '#1565C0' }}>{userInfo.firstName && userInfo.firstName[0]}</Avatar>
                <Typography variant='h6' style={{ marginLeft: '16px', fontWeight: 'bold' }}>
                    Chat with {userInfo.firstName} {userInfo.lastName}
                </Typography>
            </ChatHeader>
            {isLoadingContent ? (
                <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <CircularProgress />
                </Box>
            ) : (
                <ChatArea ref={chatContainerRef} onDragOver={e => e.preventDefault()} onDrop={handleDrop}>
                    {messages.map((message, index) => (
                        <Fade in={true} key={message.id} timeout={300} style={{ transitionDelay: `${index * 50}ms` }}>
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: message.sender === user.role.toLowerCase() ? 'flex-end' : 'flex-start',
                                }}
                            >
                                <MessageBubble isSender={message.sender === user.role.toLowerCase()}>
                                    {message.uploading ? (
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <CircularProgress size={20} sx={{ mr: 1 }} />
                                            <Typography variant='body2'>Uploading {message.fileName}</Typography>
                                        </Box>
                                    ) : message.isFile ? (
                                        <div
                                            onClick={() => handleDownload(message)}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                color: 'inherit',
                                                textDecoration: 'none',
                                                cursor: 'pointer',
                                            }}
                                        >
                                            <AttachFileIcon style={{ marginRight: '8px' }} />
                                            {message.fileName}
                                        </div>
                                    ) : (
                                        <Typography variant='body1'>{message.content}</Typography>
                                    )}
                                    <Typography variant='caption' sx={{ display: 'block', marginTop: '4px' }}>
                                        {message.uploadedDateTime}
                                    </Typography>
                                </MessageBubble>
                            </Box>
                        </Fade>
                    ))}
                </ChatArea>
            )}
            <InputArea>
                <input type='file' style={{ display: 'none' }} ref={fileInputRef} onChange={handleFileUpload} />
                <IconButton onClick={() => fileInputRef.current.click()} color='primary' disabled={isUploading || isLoadingContent}>
                    <AttachFileIcon />
                </IconButton>
                <StyledTextField
                    fullWidth
                    variant='outlined'
                    placeholder='Type a message'
                    value={inputMessage}
                    onChange={e => setInputMessage(e.target.value)}
                    onKeyPress={e => {
                        if (e.key === 'Enter') {
                            handleSendMessage();
                        }
                    }}
                    style={{ margin: '0 8px' }}
                    disabled={isUploading || isLoadingContent}
                />
                <Button
                    variant='contained'
                    endIcon={<SendIcon />}
                    onClick={handleSendMessage}
                    sx={{
                        borderRadius: '24px',
                        color: 'black',
                        backgroundColor: 'white',
                        border: '1px solid #e0e0e0',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                            backgroundColor: 'white',
                            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.4)',
                        },
                    }}
                    disabled={isUploading || isLoadingContent}
                ></Button>
            </InputArea>
        </ChatContainer>
    );
};

export default Chat;
