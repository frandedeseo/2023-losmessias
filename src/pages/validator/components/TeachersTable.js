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
import { useState } from 'react';

// Utils
import { getColor } from '@/utils/getColor';

// Styles
import { styles } from '../styles.js';

export default function TeachersTable({ teachers }) {
    const [teacher, setTeacher] = useState({});
    const [showApprovalConfirmation, setShowApprovalConfirmation] = useState(false);
    const [showRejectConfirmation, setShowRejectConfirmation] = useState(false);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [shownTeachers, setShownTeachers] = useState(teachers.slice(0, rowsPerPage));

    const handleApprove = () => {
        console.log('Approval must be done!');
        setShowApprovalConfirmation(false);
    };

    const handleReject = () => {
        console.log('Reject must be done!');
        setShowRejectConfirmation(false);
    };

    const handleApproveClick = teacher => {
        setTeacher(teacher);
        setShowApprovalConfirmation(true);
    };

    const handleRejectClick = teacher => {
        setTeacher(teacher);
        setShowRejectConfirmation(true);
    };

    const handleChangePage = (event, newPage) => {
        setShownTeachers(teachers.slice(newPage * rowsPerPage, (newPage + 1) * rowsPerPage));
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
                            <TableCell>Subjects</TableCell>
                            <TableCell align='right'>Approve</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {shownTeachers.map(teacher => (
                            <TableRow key={teacher.id}>
                                <TableCell>{teacher.name}</TableCell>
                                <TableCell>
                                    {teacher.subjects.map(subject => (
                                        <Chip
                                            key={subject}
                                            label={subject}
                                            sx={{
                                                backgroundColor: getColor(subject),
                                                marginInline: '0.1rem',
                                            }}
                                        />
                                    ))}
                                </TableCell>
                                <TableCell align='right' sx={styles.tableCell}>
                                    <Button variant='outlined' color='error' onClick={() => handleRejectClick(teacher)}>
                                        Reject
                                    </Button>
                                    <Button variant='contained' onClick={() => handleApproveClick(teacher)}>
                                        Approve
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <TablePagination
                    component='div'
                    count={teachers.length}
                    page={page}
                    rowsPerPage={rowsPerPage}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </TableContainer>

            {showApprovalConfirmation && (
                <ApprovalDialog
                    open={showApprovalConfirmation}
                    teacher={teacher}
                    setOpen={setShowApprovalConfirmation}
                    approve={handleApprove}
                />
            )}
            <RejectionDialog open={showRejectConfirmation} setOpen={setShowRejectConfirmation} reject={handleReject} teacher={teacher} />
        </>
    );
}
