import { useState, useEffect } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    TextField,
    IconButton,
    Typography,
    Box,
    Snackbar,
    Alert,
    CircularProgress,
    Backdrop, // Import Backdrop
} from '@mui/material';
import { Edit as EditIcon } from '@mui/icons-material';
import { CheckIcon } from 'lucide-react';
import axios from 'axios'; // or fetch API if you prefer
import { useUser } from '@/context/UserContext';
import { fetcherGetWithToken, fetcherPostWithToken } from '@/helpers/FetchHelpers';
import useSWR from 'swr';

export default function Classes() {
    const [subjects, setSubjects] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [editPrice, setEditPrice] = useState('');
    const [alert, setAlert] = useState(false);
    const [isSaving, setIsSaving] = useState(false); // New state for saving loader
    const [alertMessage, setAlertMessage] = useState('');
    const user = useUser();

    const { data, isValidating } = useSWR(
        [`${process.env.NEXT_PUBLIC_API_URI}/api/professor-subject/findByProfessor/${user.id}`, user.token],
        fetcherGetWithToken,
        { fallbackData: [] }
    );

    useEffect(() => {
        if (data && data.length > 0) {
            setSubjects(data);
        } else {
            setSubjects([]); // Ensure subjects is an empty array if no data
        }
    }, [data]);

    const handleEdit = (id, currentPrice, suggestedPrice) => {
        setEditingId(id);

        // Use suggestedPrice if currentPrice is null or undefined
        const priceToEdit = currentPrice !== null && currentPrice !== undefined ? currentPrice : suggestedPrice;
        setEditPrice(priceToEdit.toString());
    };

    const handleSave = id => {
        setIsSaving(true); // Start loader when saving
        fetch(`${process.env.NEXT_PUBLIC_API_URI}/api/professor-subject/edit-price?id=${id}&price=${parseFloat(editPrice)}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${user.token}`,
            },
        }).then(response => {
            setIsSaving(false); // Stop loader after saving
            if (!response.ok) {
                // Read the response as text if it's not JSON
                return response.text().then(errorMessage => {
                    setAlertMessage(errorMessage || 'An error occurred while saving the price.');
                    setAlert(true);
                });
            } else {
                setSubjects(subjects.map(subject => (subject.id === id ? { ...subject, price: parseFloat(editPrice) } : subject)));
                setEditingId(null);
            }
        });
    };

    const handlePriceChange = e => {
        const value = e.target.value;

        // Ensure the value is a non-negative number
        if (value >= 0) {
            setEditPrice(value);
        } else {
            // Optionally, you could show a message or do nothing if the value is negative
            setAlertMessage('Price cannot be negative.');
            setAlert(true);
        }
    };

    return (
        <Box sx={{ width: '100%', maxWidth: 800, margin: 'auto', mt: 4 }}>
            <Typography variant='h4' component='h2' gutterBottom>
                Prices Per Classes
            </Typography>

            {/* Backdrop to block the whole screen */}
            <Backdrop open={isSaving} sx={{ color: '#fff' }}>
                <CircularProgress color='inherit' />
            </Backdrop>

            <TableContainer component={Paper}>
                {isValidating ? (
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            minHeight: '300px', // Adjust the height as needed
                        }}
                    >
                        <CircularProgress />
                    </Box>
                ) : (
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Subject</TableCell>
                                <TableCell align='right' sx={{ opacity: 0.7 }}>
                                    Suggested price
                                </TableCell>
                                <TableCell align='right'>Price per hour</TableCell>
                                <TableCell align='right'>Action</TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {subjects.length > 0 ? (
                                subjects.map(subject => (
                                    <TableRow key={subject.id}>
                                        <TableCell component='th' scope='row'>
                                            {subject.subject.name}
                                        </TableCell>
                                        <TableCell align='right' sx={{ opacity: 0.7 }}>
                                            {`$${subject.subject.price.toFixed(2)}`}
                                        </TableCell>

                                        <TableCell align='right'>
                                            {editingId === subject.id ? (
                                                <TextField
                                                    value={editPrice}
                                                    onChange={handlePriceChange}
                                                    type='number'
                                                    size='small'
                                                    sx={{ width: 80 }}
                                                    inputProps={{ style: { textAlign: 'center' }, min: 0 }} // Prevent negative values
                                                />
                                            ) : (
                                                `$${
                                                    subject.price !== null && subject.price !== undefined
                                                        ? subject.price.toFixed(2)
                                                        : subject.subject.price.toFixed(2)
                                                }`
                                            )}
                                        </TableCell>
                                        <TableCell align='right'>
                                            {editingId === subject.id ? (
                                                <IconButton onClick={() => handleSave(subject.id)} color='primary'>
                                                    <CheckIcon />
                                                </IconButton>
                                            ) : (
                                                <IconButton
                                                    onClick={() => handleEdit(subject.id, subject.price, subject.subject.price)}
                                                    color='primary'
                                                >
                                                    <EditIcon />
                                                </IconButton>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={4} align='center'>
                                        No subjects have been approved yet
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                )}
            </TableContainer>
            <Snackbar
                open={alert}
                autoHideDuration={3000}
                onClose={() => setAlert(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert severity={'error'}>{alertMessage}</Alert>
            </Snackbar>
        </Box>
    );
}
