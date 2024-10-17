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
} from '@mui/material';
import { Edit as EditIcon, Save as SaveIcon } from '@mui/icons-material';
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
    const [isLoading, setIsLoading] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const user = useUser();

    const { data } = useSWR(
        [`${process.env.NEXT_PUBLIC_API_URI}/api/professor-subject/findByProfessor/${user.id}`, user.token],
        fetcherGetWithToken,
        { fallbackData: [] }
    );
    useEffect(() => {
        if (data.length > 0) {
            setSubjects(data);
        }
    }, [data]);

    const handleEdit = (id, currentPrice, suggestedPrice) => {
        setEditingId(id);

        // Use suggestedPrice if currentPrice is null or undefined
        const priceToEdit = currentPrice !== null && currentPrice !== undefined ? currentPrice : suggestedPrice;
        setEditPrice(priceToEdit.toString());
    };

    const handleSave = id => {
        fetch(`${process.env.NEXT_PUBLIC_API_URI}/api/professor-subject/edit-price?id=${id}&price=${parseFloat(editPrice)}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${user.token}`,
            },
        }).then(response => {
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
            <TableContainer component={Paper}>
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
                        {subjects.map(subject => (
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
                        ))}
                    </TableBody>
                </Table>
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
