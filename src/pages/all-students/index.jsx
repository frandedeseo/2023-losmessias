import { useEffect, useState } from 'react';
import { useUser } from '@/context/UserContext';
import {
    Box,
    Button,
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
    TableSortLabel,
    TextField,
    Tooltip,
    Typography,
} from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import SearchIcon from '@mui/icons-material/Search';
import Layout from '@/components/ui/Layout.jsx';
import { styles } from '../../styles/validator-styles.js';

export default function AllStudents() {
    const [allStudents, setAllStudents] = useState([]);
    const [students, setStudents] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [isLoading, setIsLoading] = useState(true);
    const [searchValue, setSearchValue] = useState('');
    const [sorter, setSorter] = useState({ field: null, direction: null });

    const user = useUser();

    useEffect(() => {
        if (user.id && user.authenticated) {
            const requestOptions = {
                method: 'GET',
                headers: { Authorization: `Bearer ${user.token}` },
            };
            setIsLoading(true);
            fetch(`${process.env.NEXT_PUBLIC_API_URI}/api/student/all`, requestOptions)
                .then(res =>
                    res.json().then(json => {
                        setAllStudents(json);
                        setStudents(json);
                    })
                )
                .finally(() => setIsLoading(false));
        }
    }, [user]);

    function applySearchFilter(searchValue, data) {
        let filteredStudents = data;

        if (searchValue !== '') {
            filteredStudents = filteredStudents.filter(
                student =>
                    student.firstName.toLowerCase().includes(searchValue.toLowerCase()) ||
                    student.lastName.toLowerCase().includes(searchValue.toLowerCase())
            );
        }

        return filteredStudents;
    }

    const sortData = (data, field, direction) => {
        const sortedData = [...data];

        const getNestedValue = (obj, path) => {
            return path.split('.').reduce((value, key) => value && value[key], obj);
        };

        sortedData.sort((a, b) => {
            const valueA = getNestedValue(a, field);
            const valueB = getNestedValue(b, field);

            if (typeof valueA === 'number' && typeof valueB === 'number') {
                return direction === 'asc' ? valueA - valueB : valueB - valueA;
            }

            if (typeof valueA === 'string' && typeof valueB === 'string') {
                return direction === 'asc' ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
            }

            return 0;
        });
        return sortedData;
    };

    const handleSearch = e => {
        e.preventDefault();
        setPage(0);
        let filteredData = applySearchFilter(searchValue, allStudents);
        if (sorter.field && sorter.direction) {
            filteredData = sortData(filteredData, sorter.field, sorter.direction);
        }
        setStudents(filteredData);
    };

    const handleSorterClick = property => {
        let newDirection = 'asc';
        if (sorter.field === property && sorter.direction === 'asc') {
            newDirection = 'desc';
        } else if (sorter.field === property && sorter.direction === 'desc') {
            newDirection = null;
        }

        const newSorter = {
            field: newDirection ? property : null,
            direction: newDirection,
        };

        let filteredData = applySearchFilter(searchValue, allStudents);
        if (newSorter.field && newSorter.direction) {
            filteredData = sortData(filteredData, newSorter.field, newSorter.direction);
        }

        setStudents(filteredData);
        setPage(0);
        setSorter(newSorter);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = event => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    return (
        <Layout>
            <div style={styles.container}>
                <Typography variant='h4'>Students</Typography>
                <Divider />
                <div style={{ paddingBlock: '1rem' }} />
                <form onSubmit={handleSearch}>
                    <TextField
                        value={searchValue}
                        onChange={event => setSearchValue(event.target.value)}
                        label='Search'
                        variant='outlined'
                        size='small'
                    />
                    <Button variant='contained' type='submit'>
                        <SearchIcon />
                    </Button>
                </form>
                <div style={{ marginTop: '1rem' }} />

                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>
                                    <TableSortLabel
                                        active={sorter.field === 'feedbackReceived.avgRating'}
                                        direction={sorter.field === 'feedbackReceived.avgRating' ? sorter.direction : 'asc'}
                                        onClick={() => handleSorterClick('feedbackReceived.avgRating')}
                                    >
                                        Rating
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell align='center'>
                                    <Tooltip title='Is always on time'>
                                        <TableSortLabel
                                            active={sorter.field === 'feedbackReceived.sumPunctuality'}
                                            direction={sorter.field === 'feedbackReceived.sumPunctuality' ? sorter.direction : 'asc'}
                                            onClick={() => handleSorterClick('feedbackReceived.sumPunctuality')}
                                        >
                                            <AccessTimeIcon />
                                        </TableSortLabel>
                                    </Tooltip>
                                </TableCell>
                                <TableCell align='center'>
                                    <Tooltip title='Do the homework'>
                                        <TableSortLabel
                                            active={sorter.field === 'feedbackReceived.sumMaterial'}
                                            direction={sorter.field === 'feedbackReceived.sumMaterial' ? sorter.direction : 'asc'}
                                            onClick={() => handleSorterClick('feedbackReceived.sumMaterial')}
                                        >
                                            <InsertDriveFileIcon />
                                        </TableSortLabel>
                                    </Tooltip>
                                </TableCell>
                                <TableCell align='center'>
                                    <Tooltip title='Pays attention and listens'>
                                        <TableSortLabel
                                            active={sorter.field === 'feedbackReceived.sumPolite'}
                                            direction={sorter.field === 'feedbackReceived.sumPolite' ? sorter.direction : 'asc'}
                                            onClick={() => handleSorterClick('feedbackReceived.sumPolite')}
                                        >
                                            <SentimentSatisfiedAltIcon />
                                        </TableSortLabel>
                                    </Tooltip>
                                </TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {isLoading ? (
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
                                            <Typography variant='h4'>Loading students...</Typography>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ) : students.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={8} align='center'>
                                        <Typography variant='h4'>No students found</Typography>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                students.slice(page * rowsPerPage, (page + 1) * rowsPerPage).map(stu => (
                                    <TableRow key={stu.id}>
                                        <TableCell>{`${stu.firstName} ${stu.lastName}`}</TableCell>
                                        <TableCell>{stu.email}</TableCell>
                                        <TableCell>
                                            <div style={{ display: 'flex', gap: 5 }}>
                                                <Rating precision={0.5} value={stu.feedbackReceived.avgRating} max={3} readOnly />
                                                <Typography>{`(${stu.feedbackReceived.avgRating.toFixed(2)})`}</Typography>
                                            </div>
                                        </TableCell>
                                        <TableCell align='center'>{stu.feedbackReceived.sumPunctuality}</TableCell>
                                        <TableCell align='center'>{stu.feedbackReceived.sumMaterial}</TableCell>
                                        <TableCell align='center'>{stu.feedbackReceived.sumPolite}</TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                    <TablePagination
                        component='div'
                        count={students ? students.length : 0}
                        page={page}
                        rowsPerPage={rowsPerPage}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </TableContainer>
            </div>
        </Layout>
    );
}
