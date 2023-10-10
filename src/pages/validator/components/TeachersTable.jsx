// Componenst
import RejectionDialog from './RejectionDialog';
import ApprovalDialog from './ApprovalDialog';

// Mui
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Button, Chip, TablePagination } from '@mui/material';

// Hooks
import { useEffect, useState } from 'react';

// Utils
import { getColor } from '@/utils/getColor';

// Styles
import { styles } from '../styles.js';

export default function TeachersTable({ data, approve, reject }) {
    const [teacherSubject, setTeacherSubject] = useState({});
    const [showApprovalConfirmation, setShowApprovalConfirmation] = useState(false);
    const [showRejectConfirmation, setShowRejectConfirmation] = useState(false);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [teachersSubjects, setTeachersSubjects] = useState({});
    const [shownTeachersSubjects, setShownTeachersSubjects] = useState([]);

    useEffect(() => {
        setTeachersSubjects(data);
        setShownTeachersSubjects(data.slice(0, rowsPerPage));
    }, [data]);

    const handleApprove = () => {
        approve(teacherSubject);
        setShowApprovalConfirmation(false);
    };

    const handleReject = () => {
        reject(teacherSubject);
        setShowRejectConfirmation(false);
    };

    const handleApproveClick = teacher => {
        setTeacherSubject(teacher);
        setShowApprovalConfirmation(true);
    };

    const handleRejectClick = teacherSubject => {
        setTeacherSubject(teacherSubject);
        setShowRejectConfirmation(true);
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
        <>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Subject</TableCell>
                            <TableCell align='right'>Approve</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {shownTeachersSubjects.map(teacherSubject => (
                            <TableRow key={teacherSubject.id}>
                                <TableCell>{`${teacherSubject.professor.firstName} ${teacherSubject.professor.lastName}`}</TableCell>
                                <TableCell>
                                    {/* {teacher.subjects.map(subject => (
                                        <Chip
                                            key={subject}
                                            label={subject}
                                            sx={{
                                                backgroundColor: getColor(subject),
                                                marginInline: '0.1rem',
                                            }}
                                        />
                                    ))} */}
                                    <Chip
                                        label={teacherSubject.subject.name}
                                        sx={{
                                            backgroundColor: getColor(teacherSubject.subject.name),
                                        }}
                                    />
                                </TableCell>
                                <TableCell align='right' sx={styles.tableCell}>
                                    <Button variant='outlined' color='error' onClick={() => handleRejectClick(teacherSubject)}>
                                        Reject
                                    </Button>
                                    <Button variant='contained' onClick={() => handleApproveClick(teacherSubject)}>
                                        Approve
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <TablePagination
                    component='div'
                    count={data.length}
                    page={page}
                    rowsPerPage={rowsPerPage}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </TableContainer>

            {showApprovalConfirmation && (
                <ApprovalDialog
                    open={showApprovalConfirmation}
                    teacher={teacherSubject}
                    setOpen={setShowApprovalConfirmation}
                    approve={handleApprove}
                />
            )}
            <RejectionDialog
                open={showRejectConfirmation}
                teacher={teacherSubject}
                setOpen={setShowRejectConfirmation}
                reject={handleReject}
            />
        </>
    );
}
