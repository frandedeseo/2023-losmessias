import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Button, Chip, TablePagination } from '@mui/material';

const colors = ['#f87171', '#fb923c', '#fbbf24', '#a3e635', '#2dd4bf', '#818cf8', '#f472b6'];
function getColor(string) {
    let hash = 0;
    for (let i = 0; i < string.length; i++) {
        hash += string.charCodeAt(i);
    }
    hash = hash % colors.length;

    return colors[hash];
}

export default function TeachersTable({ teachers }) {
    return (
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
                    {teachers.map(teacher => (
                        <TableRow key={teacher.name} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
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
                            <TableCell
                                align='right'
                                sx={{
                                    display: 'flex',
                                    gap: '0.5rem',
                                }}
                            >
                                <Button variant='outlined' color='error'>
                                    Reject
                                </Button>
                                <Button variant='contained'>Approve</Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <TablePagination component='div' count={100} page={1} rowsPerPage={10} />
        </TableContainer>
    );
}
