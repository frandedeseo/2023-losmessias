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

export default function Feedbacks() {
    const [allFeedbacks, setAllFeedbacks] = useState([]);
    const [feedbacks, setFeedbacks] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [isLoading, setIsLoading] = useState(true);
    const [searchValue, setSearchValue] = useState('');

    const user = useUser();

    useEffect(() => {
        if (user.id) {
            // const requestOptions = {
            //     method: 'GET',
            //     headers: { Authorization: `Bearer ${user.token}` },
            // };
            // setIsLoading(true);
            // fetch(`${process.env.NEXT_PUBLIC_API_URI}/api/student/all`, requestOptions)
            //     .then(res =>
            //         res.json().then(json => {
            //             setAllFeedbacks(json);
            //             setFeedbacks(json);
            //         })
            //     )
            //     .finally(() => setIsLoading(false));
        }
    }, [user]);

    const handleSearch = e => {
        e.preventDefault();

        if (searchValue !== '') {
            setFeedbacks(
                allFeedbacks.filter(
                    prevStudents =>
                        prevStudents.firstName.toLowerCase().includes(searchValue.toLowerCase()) ||
                        prevStudents.lastName.toLowerCase().includes(searchValue.toLowerCase())
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
                                    <TableCell colSpan={3} align='center'>
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                flexDirection: 'row',
                                            }}
                                        >
                                            <CircularProgress sx={{ mr: 2 }} />
                                            <Typography variant='h4'>Loading professors...</Typography>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            </>
                        ) : (
                            <>
                                {feedbacks.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={3} align='center'>
                                            <Typography variant='h4'>No students found</Typography>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    <>
                                        {feedbacks.map(stu => (
                                            <TableRow key={stu.id}>
                                                <TableCell>{`${stu.firstName} ${stu.lastName}`}</TableCell>
                                                <TableCell>{stu.email}</TableCell>
                                                <TableCell>
                                                    <Rating precision={0.5} value={1.5} max={3} readOnly />
                                                </TableCell>
                                                <TableCell align='center'>0</TableCell>
                                                <TableCell align='center'>0</TableCell>
                                                <TableCell align='center'>0</TableCell>
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
