// components
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

export default function AllStudents() {
    const [allStudents, setAllStudents] = useState([]);
    const [students, setStudents] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [isLoading, setIsLoading] = useState(true);
    const [searchValue, setSearchValue] = useState('');
    const [sorters, setSorters] = useState({
        avgRating: false,
        sumPunctuality: false,
        sumMaterial: false,
        sumPolite: false,
    });

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

    const handleSearch = e => {
        e.preventDefault();
        setPage(0);

        if (searchValue !== '') {
            setStudents(
                allStudents.filter(
                    prevStudents =>
                        prevStudents.firstName.toLowerCase().includes(searchValue.toLowerCase()) ||
                        prevStudents.lastName.toLowerCase().includes(searchValue.toLowerCase())
                )
            );
        } else setStudents(allStudents);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = event => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    // Helper function to access nested properties
    const getNestedValue = (obj, path) => {
        return path.split('.').reduce((value, key) => (value ? value[key] : null), obj);
    };

    function sortDataBy(field, direction) {
        const sortedStudents = [...allStudents];

        sortedStudents.sort((a, b) => {
            const valueA = getNestedValue(a, field);
            const valueB = getNestedValue(b, field);

            console.log(`Sorting by ${field}, direction: ${direction}`);
            console.log(`Value A: ${valueA}, Value B: ${valueB}`);

            if (typeof valueA === 'number' && typeof valueB === 'number') {
                return direction === 'asc' ? valueA - valueB : valueB - valueA;
            }

            if (typeof valueA === 'string' && typeof valueB === 'string') {
                return direction === 'asc' ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
            }

            return 0; // Default case if values are not comparable
        });

        setStudents(sortedStudents);
        setPage(0);
    }

    const handleSorterClick = property => {
        let newSorter = {};
        Object.keys(sorters).forEach(key => {
            if (key === property) {
                if (!sorters[key]) newSorter[key] = 'asc';
                else if (sorters[key] === 'asc') newSorter[key] = 'desc';
                else if (sorters[key] === 'desc') newSorter[key] = false;
            } else newSorter[key] = false;
        });

        console.log(`Sorting by: ${property}, Direction: ${newSorter[property]}`);

        sortDataBy(property, newSorter[property]);
        setSorters(newSorter);
    };

    return (
        <Layout>
            <div>
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
                                        active={sorters.avgRating !== false}
                                        direction={sorters.avgRating ? sorters.avgRating : 'asc'}
                                        onClick={() => handleSorterClick('feedbackReceived.avgRating')}
                                    >
                                        Rating
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell align='center'>
                                    <Tooltip title='Is always on time'>
                                        <TableSortLabel
                                            active={sorters.sumPunctuality !== false}
                                            direction={sorters.sumPunctuality ? sorters.sumPunctuality : 'asc'}
                                            onClick={() => handleSorterClick('feedbackReceived.sumPunctuality')}
                                        >
                                            <AccessTimeIcon />
                                        </TableSortLabel>
                                    </Tooltip>
                                </TableCell>
                                <TableCell align='center'>
                                    <Tooltip title='Do the homework'>
                                        <TableSortLabel
                                            active={sorters.sumMaterial !== false}
                                            direction={sorters.sumMaterial ? sorters.sumMaterial : 'asc'}
                                            onClick={() => handleSorterClick('feedbackReceived.sumMaterial')}
                                        >
                                            <InsertDriveFileIcon />
                                        </TableSortLabel>
                                    </Tooltip>
                                </TableCell>
                                <TableCell align='center'>
                                    <Tooltip title='Pays attention and listens'>
                                        <TableSortLabel
                                            active={sorters.sumPolite !== false}
                                            direction={sorters.sumPolite ? sorters.sumPolite : 'asc'}
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
