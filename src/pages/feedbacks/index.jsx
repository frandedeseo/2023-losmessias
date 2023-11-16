// components
import Searchbar from '@/components/Searchbar.jsx';

// Hooks
import { useEffect, useState } from 'react';
import { useUser } from '@/context/UserContext';
import { getColor } from '@/utils/getColor.js';

// styles
import { styles } from '../../styles/validator-styles.js';

// Mui
import {
    Box,
    Button,
    Chip,
    CircularProgress,
    Divider,
    Paper,
    Rating,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    TextField,
    Tooltip,
    Typography,
} from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import SearchIcon from '@mui/icons-material/Search';
import { useRouter } from 'next/router.js';

export default function Feedbacks() {
    const [allFeedbacks, setAllFeedbacks] = useState([]);
    const [feedbacks, setFeedbacks] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [isLoading, setIsLoading] = useState(true);
    const [searchValue, setSearchValue] = useState('');

    const user = useUser();
    const router = useRouter();

    useEffect(() => {
        if (user.id) {
            if (user.role === 'professor') router.push('/professor-landing');
            if (user.role === 'student') router.push('/student-landing');
            const requestOptions = {
                method: 'GET',
                headers: { Authorization: `Bearer ${user.token}` },
            };
            setIsLoading(true);
            fetch(`${process.env.NEXT_PUBLIC_API_URI}/api/feedback/getAllFeedbacks`, requestOptions)
                .then(res =>
                    res.json().then(json => {
                        setAllFeedbacks(json);
                        setFeedbacks(json);
                    })
                )
                .finally(() => setIsLoading(false));
        } else {
            router.push('/');
        }
    }, [user, router]);

    const handleSearch = e => {
        e.preventDefault();

        if (searchValue !== '') {
            setFeedbacks(
                allFeedbacks.filter(
                    prevFeedbacks =>
                        prevFeedbacks.professor.firstName.toLowerCase().includes(searchValue.toLowerCase()) ||
                        prevFeedbacks.professor.lastName.toLowerCase().includes(searchValue.toLowerCase()) ||
                        prevFeedbacks.student.firstName.toLowerCase().includes(searchValue.toLowerCase()) ||
                        prevFeedbacks.student.lastName.toLowerCase().includes(searchValue.toLowerCase())
                )
            );
        } else setFeedbacks(allFeedbacks);
    };

    const handleChangePage = (event, newPage) => {
        setShownTeachersSubjects(teachersSubjects.slice(newPage * rowsPerPage, (newPage + 1) * rowsPerPage));
        setPage(newPage);
    };

    const handleChangeRowsPerPage = event => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    return (
        <div style={styles.container}>
            <Typography variant='h4'>Feedbacks</Typography>
            <Divider />
            <div style={{ paddingBlock: '1rem' }} />
            <form onSubmit={handleSearch} style={styles.searchForm}>
                <TextField
                    value={searchValue}
                    onChange={event => setSearchValue(event.target.value)}
                    label='Search'
                    variant='outlined'
                    size='small'
                    sx={styles.searchInput}
                />
                <Button variant='contained' type='submit' sx={styles.searchButton}>
                    <SearchIcon />
                </Button>
            </form>
            <div style={styles.divPadding} />

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Giver</TableCell>
                            <TableCell>Receiver</TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell>Rating</TableCell>
                            <TableCell align='center'>
                                <AccessTimeIcon />
                            </TableCell>
                            <TableCell align='center'>
                                <InsertDriveFileIcon />
                            </TableCell>
                            <TableCell align='center'>
                                <SentimentSatisfiedAltIcon />
                            </TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {isLoading ? (
                            <>
                                <TableRow>
                                    <TableCell colSpan={8} align='center'>
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                flexDirection: 'row',
                                            }}
                                        >
                                            <CircularProgress sx={{ mr: 2 }} />
                                            <Typography variant='h4'>Loading feedbacks...</Typography>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            </>
                        ) : (
                            <>
                                {feedbacks.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={8} align='center'>
                                            <Typography variant='h4'>No students found</Typography>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    <>
                                        {feedbacks.map(feed => (
                                            <TableRow key={feed.id}>
                                                <TableCell>
                                                    {feed.receptorRole === 'STUDENT'
                                                        ? `${feed.professor.firstName} ${feed.professor.lastName}`
                                                        : `${feed.student.firstName} ${feed.student.lastName}`}
                                                </TableCell>
                                                <TableCell>
                                                    {feed.receptorRole === 'STUDENT'
                                                        ? `${feed.student.firstName} ${feed.student.lastName}`
                                                        : `${feed.professor.firstName} ${feed.professor.lastName}`}
                                                </TableCell>
                                                <TableCell>
                                                    {`${feed.dateTimeOfFeedback[2]}-${feed.dateTimeOfFeedback[1]}-${feed.dateTimeOfFeedback[0]}`}
                                                </TableCell>
                                                <TableCell>
                                                    <Rating precision={0.5} value={feed.rating} max={3} readOnly />
                                                </TableCell>
                                                <TableCell align='center'>{feed.feedbackOptions.includes('PUNCTUALITY') ? 1 : 0}</TableCell>
                                                <TableCell align='center'>{feed.feedbackOptions.includes('MATERIAL') ? 1 : 0}</TableCell>
                                                <TableCell align='center'>{feed.feedbackOptions.includes('POLITE') ? 1 : 0}</TableCell>
                                            </TableRow>
                                        ))}
                                    </>
                                )}
                            </>
                        )}
                    </TableBody>
                </Table>
                <TablePagination
                    component='div'
                    count={feedbacks ? feedbacks.length : 0}
                    page={page}
                    rowsPerPage={rowsPerPage}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </TableContainer>
        </div>
    );
}
