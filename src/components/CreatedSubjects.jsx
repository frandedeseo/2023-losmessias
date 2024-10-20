import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Divider,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Snackbar,
    Alert,
    Grid,
    Backdrop,
    CircularProgress,
} from '@mui/material';
import { Edit as EditIcon } from '@mui/icons-material';
import { CheckIcon } from 'lucide-react';
import useWindowSize from '@/hooks/useWindowSize';
import { useUser } from '@/context/UserContext';
import useSWR from 'swr';
import { fetcherGetWithToken } from '@/helpers/FetchHelpers';

const CreatedSubjects = ({ open, setOpen }) => {
    const windowSize = useWindowSize();
    const user = useUser();

    // State variables for subject name and price inputs
    const [subjectName, setSubjectName] = useState('');
    const [subjectPrice, setSubjectPrice] = useState('');

    // State variables for subjects list and editing functionality
    const [subjects, setSubjects] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [editPrice, setEditPrice] = useState('');

    // State for the alert (snackbar)
    const [alert, setAlert] = useState({ open: false, message: '', severity: 'success' });

    // State for showing loader
    const [loading, setLoading] = useState(false);

    // Fetching subjects using SWR
    const { data } = useSWR([`${process.env.NEXT_PUBLIC_API_URI}/api/subject/all`, user.token], fetcherGetWithToken, { fallbackData: [] });

    useEffect(() => {
        if (data.length > 0) {
            setSubjects(data);
        }
    }, [data]);

    // Handle dialog close
    const handleClose = () => {
        setOpen(false);
        setSubjectName('');
        setSubjectPrice('');
    };

    // Handle subject creation
    const handleCreate = () => {
        const priceValue = parseFloat(subjectPrice);
        if (isNaN(priceValue) || priceValue < 0) {
            setAlert({
                open: true,
                message: 'Please enter a valid, non-negative price.',
                severity: 'error',
            });
            return;
        }

        // Show loader
        setLoading(true);

        fetch(`${process.env.NEXT_PUBLIC_API_URI}/api/subject/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${user.token}`,
            },
            body: JSON.stringify({
                name: subjectName.trim(),
                price: parseFloat(subjectPrice),
            }),
        })
            .then(res => {
                if (!res.ok) {
                    // Get the error as text instead of JSON
                    return res.text().then(errorText => {
                        throw new Error(errorText || 'Failed to create subject');
                    });
                }
                return res.json();
            })
            .then(newSubject => {
                setSubjects([...subjects, newSubject]);
                setSubjectName('');
                setSubjectPrice('');
                setAlert({
                    open: true,
                    message: 'Subject created successfully!',
                    severity: 'success',
                });
            })
            .catch(error => {
                setAlert({
                    open: true,
                    message: error.message || 'Failed to create subject',
                    severity: 'error',
                });
            })
            .finally(() => {
                // Hide loader
                setLoading(false);
            });
    };

    // Handle editing of subject price
    const handleEdit = (id, currentPrice) => {
        setEditingId(id);
        setEditPrice(currentPrice ? currentPrice.toString() : '');
    };

    const handleSave = id => {
        const priceValue = parseFloat(editPrice);
        if (isNaN(priceValue) || priceValue < 0) {
            setAlert({
                open: true,
                message: 'Please enter a valid, non-negative price.',
                severity: 'error',
            });
            return;
        }

        // Show loader
        setLoading(true);

        fetch(`${process.env.NEXT_PUBLIC_API_URI}/api/subject/edit-price?id=${id}&price=${parseFloat(editPrice)}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${user.token}`,
            },
        })
            .then(response => {
                if (!response.ok) {
                    return response.text().then(errorMessage => {
                        setAlert({
                            open: true,
                            message: errorMessage || 'An error occurred while saving the price.',
                            severity: 'error',
                        });
                    });
                } else {
                    setSubjects(subjects.map(subject => (subject.id === id ? { ...subject, price: parseFloat(editPrice) } : subject)));
                    setEditingId(null);
                    setAlert({
                        open: true,
                        message: 'Price updated successfully!',
                        severity: 'success',
                    });
                }
            })
            .finally(() => {
                // Hide loader
                setLoading(false);
            });
    };

    // Handle price input change during editing
    const handlePriceChange = e => {
        const value = e.target.value;
        if (value === '' || parseFloat(value) >= 0) {
            setEditPrice(value);
        } else {
            setAlert({
                open: true,
                message: 'Price cannot be negative.',
                severity: 'error',
            });
        }
    };

    // Validate that both inputs have values and the price is a number
    const isFormValid = subjectName.trim() !== '' && subjectPrice.trim() !== '' && !isNaN(subjectPrice) && parseFloat(subjectPrice) >= 0;

    return (
        <>
            <Dialog open={open} onClose={handleClose} fullWidth maxWidth='md'>
                <DialogTitle>Subjects</DialogTitle>
                <DialogContent dividers>
                    {/* Input fields for subject name and price */}
                    <Grid container spacing={2} sx={{ mb: 2 }}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                value={subjectName}
                                label='Subject Name'
                                onChange={event => {
                                    setSubjectName(event.target.value);
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                value={subjectPrice}
                                label='Subject Price'
                                onChange={event => {
                                    const value = event.target.value;
                                    if (value === '' || parseFloat(value) >= 0) {
                                        setSubjectPrice(value);
                                    } else {
                                        setAlert({
                                            open: true,
                                            message: 'Price cannot be negative.',
                                            severity: 'error',
                                        });
                                    }
                                }}
                                type='number'
                                inputProps={{ min: 0 }}
                            />
                        </Grid>
                    </Grid>

                    {/* Table displaying subjects and their prices */}
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Subject</TableCell>
                                    <TableCell align='right'>Suggested Price</TableCell>
                                    <TableCell align='right'>Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {subjects.map(subject => (
                                    <TableRow key={subject.id}>
                                        <TableCell component='th' scope='row'>
                                            {subject.name}
                                        </TableCell>
                                        <TableCell align='right'>
                                            {editingId === subject.id ? (
                                                <TextField
                                                    value={editPrice}
                                                    onChange={handlePriceChange}
                                                    type='number'
                                                    size='small'
                                                    sx={{ width: 100 }}
                                                    inputProps={{ style: { textAlign: 'center' }, min: 0 }}
                                                />
                                            ) : (
                                                `$${subject.price ? subject.price.toFixed(2) : '0.00'}`
                                            )}
                                        </TableCell>
                                        <TableCell align='right'>
                                            {editingId === subject.id ? (
                                                <IconButton onClick={() => handleSave(subject.id)} color='primary'>
                                                    <CheckIcon />
                                                </IconButton>
                                            ) : (
                                                <IconButton onClick={() => handleEdit(subject.id, subject.price)} color='primary'>
                                                    <EditIcon />
                                                </IconButton>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    {/* Snackbar for displaying alerts */}
                    <Snackbar
                        open={alert.open}
                        autoHideDuration={3000}
                        onClose={() => setAlert({ ...alert, open: false })}
                        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                    >
                        <Alert severity={alert.severity}>{alert.message}</Alert>
                    </Snackbar>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button variant='contained' onClick={handleCreate} disabled={!isFormValid}>
                        Create
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Backdrop Loader */}
            <Backdrop open={loading} sx={{ color: '#fff', zIndex: 10000 }}>
                <CircularProgress color='inherit' />
            </Backdrop>
        </>
    );
};

export default CreatedSubjects;
