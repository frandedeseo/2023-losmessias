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
    Tooltip,
    Typography,
} from '@mui/material';
import MonthlyChart from '@/components/MonthlyChart.jsx';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import { useRouter } from 'next/router';

export default function AllProfessors() {
    const [allProfessors, setAllProfessors] = useState([]);
    const [professors, setProfessors] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [open, setOpen] = useState(false);
    const [professorId, setProfessorId] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    const user = useUser();

    useEffect(() => {
        setIsLoading(true);
        if (router.isReady && user.id) {
            if (user.role == 'professor') router.push('/professor-landing');
            if (user.role === 'student') router.push('/student-landing');
            const requestOptions = {
                method: 'GET',
                headers: { Authorization: `Bearer ${user.token}` },
            };
            fetch(`${process.env.NEXT_PUBLIC_API_URI}/api/professor/all`, requestOptions).then(res =>
                res.json().then(json => {
                    setAllProfessors(json);
                    setProfessors(json);
                })
            ).finally(() => setIsLoading(false));
        } else {
            router.push('/');
        }
    }, [user, router]);

    const handleSearch = (searchValue, filterValues) => {
        if (searchValue !== '' && filterValues.length === 0) {
            setProfessors(
                allProfessors.filter(
                    prevprofessors =>
                        prevprofessors.firstName.toLowerCase().includes(searchValue.toLowerCase()) ||
                        prevprofessors.lastName.toLowerCase().includes(searchValue.toLowerCase())
                )
            );
        } else if (searchValue === '' && filterValues.length > 0) {
            setProfessors(
                allProfessors.filter(prevProfessors => prevProfessors.subjects.some(subject => filterValues.includes(subject.name)))
            );
        } else if (searchValue !== '' && filterValues.length > 0) {
            setProfessors(
                allProfessors.filter(
                    prevProfessors =>
                        (prevProfessors.firstName.toLowerCase().includes(searchValue.toLowerCase()) ||
                            prevProfessors.lastName.toLowerCase().includes(searchValue.toLowerCase())) &&
                        prevProfessors.subjects.some(subject => filterValues.includes(subject.name))
                )
            );
        } else setProfessors(allProfessors);
    };

    const handleChangePage = (event, newPage) => {
        setShownTeachersSubjects(teachersSubjects.slice(newPage * rowsPerPage, (newPage + 1) * rowsPerPage));
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
            <Searchbar search={handleSearch} />
            <div style={styles.divPadding} />

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Subjects</TableCell>
                            <TableCell>Rating</TableCell>
                            <TableCell align='center'>
                                <Tooltip title='Is always on time'>
                                    <AccessTimeIcon />
                                </Tooltip>
                            </TableCell>
                            <TableCell align='center'>
                                <Tooltip title='Has extra material to practice'>
                                    <InsertDriveFileIcon />
                                </Tooltip>
                            </TableCell>
                            <TableCell align='center'>
                                <Tooltip title='Is respectful and patient'>
                                    <SentimentSatisfiedAltIcon />
                                </Tooltip>
                            </TableCell>
                            <TableCell align='right'>Monthly Mean</TableCell>
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
                                            <Typography variant='h4'>Loading professors...</Typography>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            </>
                        ) : (
                            <>
                                {professors.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={8} align='center'>
                                            <Typography variant='h4'>No professors found</Typography>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    <>
                                        {professors.map(prof => (
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
                                                    <Rating precision={0.5} value={prof.avgRating} max={3} readOnly />
                                                </TableCell>
                                                <TableCell align='center'>{prof.sumPunctuality}</TableCell>
                                                <TableCell align='center'>{prof.sumMaterial}</TableCell>
                                                <TableCell align='center'>{prof.sumEducated}</TableCell>
                                                <TableCell align='right'>
                                                    <Button variant='contained' onClick={() => handleClick(prof.id)}>
                                                        Dashboard
                                                    </Button>
                                                </TableCell>
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
                    count={professors ? professors.length : 0}
                    page={page}
                    rowsPerPage={rowsPerPage}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </TableContainer>

            <Dialog open={open} onClose={handleClose} fullWidth>
                <DialogTitle>Monthly Mean</DialogTitle>

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
