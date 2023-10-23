import Searchbar from '@/components/Searchbar';
import { getColor } from '@/utils/getColor';
import {
    Button,
    Chip,
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
    TextField,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useUser } from "@/context/UserContext";
import { useRouter } from 'next/router';

export default function AdminLandingPage() {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [shownProfessors, setShownProfessors] = useState([]);
    const [allProfessors, setAllProfessors] = useState([]);
    const [professors, setProfessors] = useState([]);
    const [open, setOpen] = useState(false);
    const [subject, setSubject] = useState('');
    const [subjects, setSubjects] = useState([]);
    const user = useUser();
    const router = useRouter();

    useEffect(() => {
        if (router.isReady && user.authenticated) {
            if (user.role=='student'){
                router.push("/student-landing");
            }else if(user.role=="professor"){
                router.push("/professor-landing");
            }else{
                const requestOptions = {
                    method: 'GET',
                    headers: { Authorization : `Bearer ${user.token}`}
                };
                fetch('http://localhost:8080/api/reservation/todaySummary', requestOptions).then(res =>
                    res.json().then(json => {
                        setAllProfessors(json);
                        setProfessors(json);
                        setShownProfessors(json.slice(0, rowsPerPage));
                    })
                );

                fetch(`${process.env.NEXT_PUBLIC_API_URI}/api/subject/all`).then(res =>
                    res.json().then(json => {
                        setSubjects(json);
                    })
                );
            }
        }else{
            router.push("/");
        }
    }, [user, rowsPerPage]);

    const handleSearch = (searchValue, filterValues) => {
        setPage(0);

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

    const handleChangePage = (event, newPage) => {
        setShownProfessors(professors.slice(newPage * rowsPerPage, (newPage + 1) * rowsPerPage));
        setPage(newPage);
    };

    const handleChangeRowsPerPage = event => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleClose = () => {
        setOpen(false);
        setSubject('');
    };

    const handleCreate = () => {
        fetch(`${process.env.NEXT_PUBLIC_API_URI}/api/subject/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${user.token}`
            },
            body: JSON.stringify({
                name: subject,
            }),
        }).then(res => {
            if (res.status !== 200) {
                setSubjects(prevSubjects => [...prevSubjects, { name: subject }]);
            } else {
            }
        });

        handleClose();
    };

    return (
        <div style={{ margin: '2% auto', width: '95%' }}>
            <div style={{ display: 'flex', gap: '2rem' }}>
                <Searchbar search={handleSearch} />
                <Button variant='contained' sx={{ boxShadow: 'none' }} onClick={() => setOpen(true)}>
                    Subjects
                </Button>
            </div>

            <div style={{ paddingBlock: '0.5rem' }} />

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Subject</TableCell>
                            <TableCell>Hours</TableCell>
                            <TableCell>Income</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {shownProfessors.map((prof, idx) => (
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

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Subjects</DialogTitle>

                <DialogContent dividers sx={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', paddingInline: '2rem' }}>
                        {subjects.map((sub, idx) => (
                            <Chip key={idx} label={sub.name} sx={{ backgroundColor: getColor(sub.name) }} />
                        ))}
                    </div>
                    <Divider orientation='vertical' flexItem />
                    <div style={{ paddingInline: '2rem' }}>
                        <TextField
                            fullWidth
                            value={subject}
                            label='Subject'
                            onChange={event => {
                                setSubject(event.target.value);
                            }}
                        />
                    </div>
                </DialogContent>

                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button variant='contained' onClick={handleCreate}>
                        Create
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
