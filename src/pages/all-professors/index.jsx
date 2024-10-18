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
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
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
    Tooltip,
    Typography,
} from '@mui/material';
import MonthlyChart from '@/components/MonthlyChart.jsx';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import { useRouter } from 'next/router';
import useWindowSize from '@/hooks/useWindowSize.js';

export default function AllProfessors() {
    const [allProfessors, setAllProfessors] = useState([]);
    const [professors, setProfessors] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [open, setOpen] = useState(false);
    const [professorId, setProfessorId] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const windowSize = useWindowSize();
    const [searchValue, setSearchValue] = useState('');
    const [filterValues, setFilterValues] = useState([]);
    const [sorter, setSorter] = useState({ field: null, direction: null });

    const user = useUser();

    useEffect(() => {
        setIsLoading(true);
        if (user.id) {
            const requestOptions = {
                method: 'GET',
                headers: { Authorization: `Bearer ${user.token}` },
            };
            fetch(`${process.env.NEXT_PUBLIC_API_URI}/api/professor/all`, requestOptions)
                .then(res =>
                    res.json().then(json => {
                        setAllProfessors(json);
                        setProfessors(json);
                    })
                )
                .finally(() => setIsLoading(false));
        }
    }, [user]);

    function applySearchFilter(searchValue, filterValues, data) {
        let filteredProfessors = data;

        if (searchValue !== '') {
            filteredProfessors = filteredProfessors.filter(
                professor =>
                    professor.firstName.toLowerCase().includes(searchValue.toLowerCase()) ||
                    professor.lastName.toLowerCase().includes(searchValue.toLowerCase())
            );
        }

        if (filterValues.length > 0) {
            filteredProfessors = filteredProfessors.filter(professor =>
                professor.subjects.some(subject => filterValues.includes(subject.name))
            );
        }

        return filteredProfessors;
    }

    const sortData = (data, field, direction) => {
        const sortedData = [...data];
        if (direction === 'asc') {
            sortedData.sort((a, b) => a[field] - b[field]);
        } else if (direction === 'desc') {
            sortedData.sort((a, b) => b[field] - a[field]);
        }
        return sortedData;
    };

    const handleSearch = (searchValue, filterValues) => {
        setPage(0);
        let filteredData = applySearchFilter(searchValue, filterValues, allProfessors);
        if (sorter.field && sorter.direction) {
            filteredData = sortData(filteredData, sorter.field, sorter.direction);
        }
        setProfessors(filteredData);
        setSearchValue(searchValue);
        setFilterValues(filterValues);
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

        let filteredData = applySearchFilter(searchValue, filterValues, allProfessors);
        if (newSorter.field && newSorter.direction) {
            filteredData = sortData(filteredData, newSorter.field, newSorter.direction);
        }

        setProfessors(filteredData);
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

    const handleClick = id => {
        setProfessorId(id);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div style={styles.container}>
            <Typography variant='h4'>Professors</Typography>
            <Divider />
            <div style={{ paddingBlock: '1rem' }} />

            {windowSize.width > 500}
            <Searchbar search={handleSearch} />
            <div style={styles.divPadding} />

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Subjects</TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={sorter.field === 'avgRating'}
                                    direction={sorter.field === 'avgRating' ? sorter.direction : 'asc'}
                                    onClick={() => handleSorterClick('avgRating')}
                                >
                                    Rating
                                </TableSortLabel>
                            </TableCell>
                            <TableCell align='center'>
                                <Tooltip title='Is always on time'>
                                    <TableSortLabel
                                        active={sorter.field === 'sumPunctuality'}
                                        direction={sorter.field === 'sum' ? sorter.direction : 'asc'}
                                        onClick={() => handleSorterClick('sumPunctuality')}
                                    >
                                        <AccessTimeIcon />
                                    </TableSortLabel>
                                </Tooltip>
                            </TableCell>
                            <TableCell align='center'>
                                <Tooltip title='Do the homework'>
                                    <TableSortLabel
                                        active={sorter.field === 'sum'}
                                        direction={sorter.field === 'sum' ? sorter.direction : 'asc'}
                                        onClick={() => handleSorterClick('sumMaterial')}
                                    >
                                        <InsertDriveFileIcon />
                                    </TableSortLabel>
                                </Tooltip>
                            </TableCell>
                            <TableCell base='center'>
                                <Tooltip title='Pays attention and listens'>
                                    <TableSortLabel
                                        active={sorter.field === 'sum'}
                                        direction={sorter.field === 'sum' ? sorter.direction : 'asc'}
                                        onClick={() => handleSorterClick('sumPolite')}
                                    >
                                        <SentimentSatisfiedAltIcon />
                                    </TableSortLabel>
                                </Tooltip>
                            </TableCell>
                            <TableCell base='right'>Monthly Mean</TableCell>
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
                                        <Typography variant='h4'>Loading professors...</Typography>
                                    </Box>
                                </TableCell>
                            </TableRow>
                        ) : professors.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={8} align='center'>
                                    <Typography variant='h4'>No professors found</Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            professors.slice(page * rowsPerPage, (page + 1) * rowsPerPage).map(prof => (
                                <TableRow key={prof.id} onClick={() => handleClick(prof.id)}>
                                    <TableCell>{`${prof.firstName} ${prof.lastName}`}</TableCell>
                                    <TableCell>{prof.email}</TableCell>
                                    <TableCell>
                                        {prof.subjects.map(subject => (
                                            <Chip
                                                key={subject.id}
                                                label={subject.name}
                                                sx={{
                                                    backgroundColor: getColor(subject.name),
                                                    marginRight: '0.2rem',
                                                }}
                                            />
                                        ))}
                                    </TableCell>
                                    <TableCell>
                                        <div style={{ display: 'flex', gap: 5 }}>
                                            <Rating precision={0.5} value={prof.feedbackReceived.avgRating} max={3} readOnly />
                                            <Typography>{`(${prof.feedbackReceived.avgRating.toFixed(2)})`}</Typography>
                                        </div>
                                    </TableCell>
                                    <TableCell align='center'>{prof.feedbackReceived.sumPunctuality}</TableCell>
                                    <TableCell base='center'>{prof.feedbackReceived.sumMaterial}</TableCell>
                                    <TableCell base='center'>{prof.feedbackReceived.sumPolite}</TableCell>
                                    <TableCell base='right'>
                                        <Button variant='contained' onClick={() => handleClick(prof.id)}>
                                            Dashboard
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
                <TablePagination
                    component='div'
                    count={professors.length}
                    page={page}
                    rowsPerPage={rowsPerPage}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangePage}
                />
            </TableContainer>

            <Dialog open={open} onClose={handleClose} fullWidth>
                <DialogTitle align={windowSize.width > 500 ? 'left' : 'center'}>Monthly Mean</DialogTitle>

                <DialogContent>
                    <MonthlyChart id={professorId} legend />
                </DialogContent>

                <DialogActions>
                    <Button onClick={handleClose} variant='contained'>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
