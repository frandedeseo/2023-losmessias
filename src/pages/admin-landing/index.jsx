import Searchbar from '@/components/Searchbar';
import { getColor } from '@/utils/getColor';
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
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    TableSortLabel,
    TextField,
    Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useUser } from '@/context/UserContext';
import { useRouter } from 'next/router';
import useWindowSize from '@/hooks/useWindowSize';
import CreatedSubjects from '@/components/CreatedSubjects';
import Layout from '@/components/ui/Layout';

export default function AdminLandingPage() {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [shownProfessors, setShownProfessors] = useState([]);
    const [allProfessors, setAllProfessors] = useState([]);
    const [professors, setProfessors] = useState([]);
    const [open, setOpen] = useState(false);

    const user = useUser();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const windowSize = useWindowSize();
    const [sorters, setSorters] = useState({ totalIncome: false, totalHours: false });
    const [filterValues, setFilterValues] = useState([]);
    const [searchValue, setSearchValue] = useState('');

    useEffect(() => {
        setIsLoading(true);
        if (user.id) {
            const requestOptions = {
                method: 'GET',
                headers: { Authorization: `Bearer ${user.token}` },
            };
            fetch(`${process.env.NEXT_PUBLIC_API_URI}/api/reservation/todaySummary`, requestOptions)
                .then(res =>
                    res.json().then(json => {
                        setAllProfessors(json);
                        setProfessors(json);
                        setShownProfessors(json.slice(0, rowsPerPage));
                    })
                )
                .finally(() => setIsLoading(false));
        }
    }, [user, rowsPerPage]);

    const applySearchFilter = (searchValue, filterValues) => {
        if (searchValue !== '' && filterValues.length === 0) {
            const filterProfessors = allProfessors.filter(
                prevTeacherSubject =>
                    prevTeacherSubject.professor.firstName.toLowerCase().includes(searchValue.toLowerCase()) ||
                    prevTeacherSubject.professor.lastName.toLowerCase().includes(searchValue.toLowerCase())
            );
            setProfessors(filterProfessors);
            setShownProfessors(filterProfessors.slice(0, rowsPerPage));
        } else if (searchValue === '' && filterValues.length > 0) {
            const filterProfessors = allProfessors.filter(prevTeacherSubject => filterValues.includes(prevTeacherSubject.subject.name));
            setProfessors(filterProfessors);
            setShownProfessors(filterProfessors.slice(0, rowsPerPage));
        } else if (searchValue !== '' && filterValues.length > 0) {
            const filterProfessors = allProfessors.filter(
                prevTeacherSubject =>
                    (prevTeacherSubject.professor.firstName.toLowerCase().includes(searchValue.toLowerCase()) ||
                        prevTeacherSubject.professor.lastName.toLowerCase().includes(searchValue.toLowerCase())) &&
                    filterValues.includes(prevTeacherSubject.subject.name)
            );
            setProfessors(filterProfessors);
            setShownProfessors(filterProfessors.slice(0, rowsPerPage));
        } else {
            setProfessors(allProfessors);
            setShownProfessors(allProfessors.slice(0, rowsPerPage));
        }
    };

    const handleSearch = (searchValue, filterValues) => {
        setPage(0);
        applySearchFilter(searchValue, filterValues);
        setSearchValue(searchValue);
        setFilterValues(filterValues);
    };

    const handleChangePage = (event, newPage) => {
        setShownProfessors(professors.slice(newPage * rowsPerPage, (newPage + 1) * rowsPerPage));
        setPage(newPage);
    };

    const handleChangeRowsPerPage = event => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    function sortDataBy(field, direction) {
        const ascSorter = (a, b) => {
            return a[field] - b[field];
        };

        const descSorter = (a, b) => {
            return (a[field] - b[field]) * -1;
        };

        let sortedStudents = allProfessors;
        if (direction === 'asc') sortedStudents = allProfessors.sort(ascSorter);
        else if (direction === 'desc') sortedStudents = allProfessors.sort(descSorter);

        if (searchValue !== '' || filterValues.length > 0) {
            applySearchFilter(searchValue, filterValues);
        }

        setShownProfessors(sortedStudents);
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
        sortDataBy(property, newSorter[property]);
        setSorters(newSorter);
    };

    return (
        <Layout>
            <div style={{ margin: '2% auto', width: '95%' }}>
                <Typography variant='h4'>Today&apos;s Summary</Typography>
                <Divider />
                <div style={{ paddingBlock: '1rem' }} />
                {windowSize.width > 500 && (
                    <div style={{ display: 'flex', gap: '2rem' }}>
                        <Searchbar search={handleSearch} />
                        <Button variant='contained' sx={{ boxShadow: 'none' }} onClick={() => setOpen(true)}>
                            Subjects
                        </Button>
                    </div>
                )}
                {windowSize.width <= 500 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        <div>
                            <Searchbar search={handleSearch} />
                        </div>
                        <Button variant='contained' sx={{ boxShadow: 'none' }} onClick={() => setOpen(true)}>
                            Subjects
                        </Button>
                    </div>
                )}

                <div style={{ paddingBlock: '0.5rem' }} />

                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell>Subject</TableCell>
                                <TableCell>
                                    <TableSortLabel
                                        active={sorters.totalHours}
                                        direction={!sorters.totalHours ? 'asc' : sorters.totalHours}
                                        onClick={() => handleSorterClick('totalHours')}
                                    >
                                        Hours
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell sortDirection='asc'>
                                    <TableSortLabel
                                        active={sorters.totalIncome}
                                        direction={!sorters.totalIncome ? 'asc' : sorters.totalIncome}
                                        onClick={() => handleSorterClick('totalIncome')}
                                    >
                                        Income
                                    </TableSortLabel>
                                </TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {isLoading ? (
                                <>
                                    <TableRow>
                                        <TableCell colSpan={4}>
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                }}
                                            >
                                                <CircularProgress />
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                </>
                            ) : (
                                <>
                                    {professors.length > 0 ? (
                                        <>
                                            {shownProfessors.slice(page * rowsPerPage, (page + 1) * rowsPerPage).map((prof, idx) => (
                                                <TableRow key={idx}>
                                                    <TableCell>{`${prof.professor.firstName} ${prof.professor.lastName}`}</TableCell>
                                                    <TableCell>
                                                        <Chip
                                                            label={prof.subject.name}
                                                            sx={{
                                                                backgroundColor: getColor(prof.subject.name),
                                                            }}
                                                        />
                                                    </TableCell>
                                                    <TableCell>{prof.totalHours} hs</TableCell>
                                                    <TableCell>${prof.totalIncome}</TableCell>
                                                </TableRow>
                                            ))}
                                        </>
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={4}>
                                                <Box
                                                    sx={{
                                                        display: 'flex',
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                    }}
                                                >
                                                    <Typography variant='h6' sx={{ padding: '1rem' }}>
                                                        No results found!
                                                    </Typography>
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </>
                            )}
                        </TableBody>
                    </Table>
                    <TablePagination
                        component='div'
                        count={professors?.length}
                        page={page}
                        rowsPerPage={rowsPerPage}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </TableContainer>

                <CreatedSubjects open={open} setOpen={setOpen} />
            </div>
        </Layout>
    );
}
