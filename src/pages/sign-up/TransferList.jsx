import React, { useState, useEffect } from 'react';
import {
    TextField,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    Box,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Grid,
    useMediaQuery,
    useTheme,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useApi } from '../../hooks/useApi';

export default function TransferList({ request, setPage, setStateSnackbar }) {
    const [selectedSubjects, setSelectedSubjects] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [subjects, setSubjects] = useState([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [showEmptyPriceModal, setShowEmptyPriceModal] = useState(false);

    const { sendRequestForRegistrationProfessor } = useApi();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_API_URI}/api/subject/all`)
            .then(response => response.json())
            .then(json => {
                setSubjects(json);
            })
            .catch(error => {
                console.error('Error fetching subjects:', error);
            });
    }, []);

    const handleSelectSubject = subject => {
        if (!selectedSubjects.find(s => s.id === subject.id)) {
            setSelectedSubjects([...selectedSubjects, { ...subject, new_price: '' }]);
        }
    };

    const handleRemoveSubject = subjectId => {
        setSelectedSubjects(selectedSubjects.filter(s => s.id !== subjectId));
    };

    const handlePriceChange = (subjectId, new_price) => {
        setSelectedSubjects(prevSubjects => {
            const updatedSubjects = prevSubjects.map(s => (s.id === subjectId ? { ...s, new_price } : s));
            const subject = updatedSubjects.find(s => s.id === subjectId);
            if (Number(new_price) > 2 * Number(subject.price)) {
                setStateSnackbar({
                    open: true,
                    message: `Price for ${subject.name} exceeds double the suggested price`,
                    severity: 'error',
                });
            }
            return updatedSubjects;
        });
    };

    const submitForm = async () => {
        const subjectsBody = selectedSubjects.map(subject => ({
            subject: { id: subject.id, name: subject.name, price: subject.price },
            price: subject.new_price,
        }));
        try {
            setIsProcessing(true);
            await sendRequestForRegistrationProfessor(request, subjectsBody, setIsProcessing);
            setIsProcessing(false);
            // Registration successful
            setStateSnackbar({ open: true, message: 'An email has been sent for confirmation.', severity: 'success' });
            setPage('login');
        } catch (error) {
            setIsProcessing(false);
            // Handle error
            console.error(error);
        }
    };

    const handleSubmit = async e => {
        e.preventDefault();
        const hasEmptyPrice = selectedSubjects.some(subject => subject.new_price === '');
        if (hasEmptyPrice) {
            setShowEmptyPriceModal(true);
            return;
        }
        submitForm();
    };

    const handleConfirmSubmitEmptyPrice = () => {
        setShowEmptyPriceModal(false);
        submitForm();
    };

    const filteredSubjects = subjects.filter(subject => subject.name.toLowerCase().includes(searchTerm.toLowerCase()));

    const isSubmitDisabled =
        selectedSubjects.length === 0 || selectedSubjects.some(subject => Number(subject.new_price) > 2 * Number(subject.price));

    return (
        <Box
            sx={{
                width: '100%',
                minHeight: '100vh',
                backgroundImage: 'url(/alumnos-primaria-clase.jpg)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                padding: { xs: 1, sm: 2, md: 3 },
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <Paper
                elevation={3}
                sx={{
                    p: { xs: 2, sm: 3 },
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    width: '100%',
                    maxWidth: '1200px',
                    maxHeight: '90vh',
                    overflowY: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                <Typography variant='h4' component='h1' gutterBottom align='center'>
                    Subject Selection
                </Typography>
                <Typography variant='body1' gutterBottom align='center' sx={{ paddingBottom: 2 }}>
                    Choose the subjects you can teach and set your prices.
                </Typography>
                <form onSubmit={handleSubmit} style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    <Grid container spacing={2} sx={{ flexGrow: 1 }}>
                        <Grid item xs={12} md={5}>
                            <TextField
                                fullWidth
                                variant='outlined'
                                label='Search subjects'
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                sx={{ mb: 2 }}
                            />
                            <Paper
                                sx={{
                                    height: { xs: '200px', md: 'calc(100% - 120px)' },
                                    overflow: 'auto',
                                    mb: 2,
                                }}
                            >
                                {filteredSubjects.map(subject => (
                                    <Box
                                        key={subject.id}
                                        onClick={() => handleSelectSubject(subject)}
                                        sx={{
                                            p: 1,
                                            '&:hover': {
                                                backgroundColor: 'action.hover',
                                                cursor: 'pointer',
                                            },
                                        }}
                                    >
                                        {subject.name}
                                    </Box>
                                ))}
                            </Paper>
                        </Grid>
                        <Grid item xs={12} md={7}>
                            <TableContainer
                                component={Paper}
                                sx={{
                                    height: { xs: '300px', md: 'calc(100% - 50px)' },
                                    overflow: 'auto',
                                }}
                            >
                                <Table stickyHeader size={isMobile ? 'small' : 'medium'}>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Subject</TableCell>
                                            <TableCell align='right' style={{ whiteSpace: 'nowrap' }}>
                                                Suggested price
                                            </TableCell>
                                            <TableCell align='right'>Price per half hour</TableCell>
                                            <TableCell align='right'>Action</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {selectedSubjects.map(subject => (
                                            <TableRow key={subject.id}>
                                                <TableCell>{subject.name}</TableCell>
                                                <TableCell align='right' sx={{ opacity: 0.7 }}>
                                                    ${subject.price}
                                                </TableCell>
                                                <TableCell align='right'>
                                                    <TextField
                                                        type='number'
                                                        value={subject.new_price}
                                                        onChange={e => handlePriceChange(subject.id, e.target.value)}
                                                        variant='outlined'
                                                        size='small'
                                                        error={Number(subject.new_price) > 2 * Number(subject.price)}
                                                        inputProps={{
                                                            style: {
                                                                textAlign: 'center',
                                                                width: isMobile ? 60 : 80,
                                                                paddingRight: isMobile ? 5 : 10,
                                                            },
                                                        }}
                                                    />
                                                </TableCell>
                                                <TableCell align='right'>
                                                    <IconButton onClick={() => handleRemoveSubject(subject.id)} size='small'>
                                                        <CloseIcon />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Grid>
                    </Grid>
                    <Button type='submit' variant='contained' color='primary' fullWidth sx={{ mt: 2 }} disabled={isSubmitDisabled}>
                        Submit
                    </Button>
                </form>
            </Paper>

            {/* Empty Price Confirmation Dialog */}
            <Dialog open={showEmptyPriceModal} onClose={() => setShowEmptyPriceModal(false)}>
                <DialogTitle>Empty Prices Detected</DialogTitle>
                <DialogContent>
                    <DialogContentText>Some of the selected subjects have empty prices. Do you want to proceed?</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowEmptyPriceModal(false)} color='primary'>
                        Cancel
                    </Button>
                    <Button onClick={handleConfirmSubmitEmptyPrice} color='primary'>
                        Proceed
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Processing Dialog */}
            <Dialog open={isProcessing}>
                <DialogTitle>Processing registration...</DialogTitle>
                <DialogContent>
                    <DialogContentText>Please wait while we process your registration.</DialogContentText>
                </DialogContent>
            </Dialog>
        </Box>
    );
}
