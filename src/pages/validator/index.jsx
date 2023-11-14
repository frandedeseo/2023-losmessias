// components
import TeachersTable from './components/TeachersTable';
import Searchbar from '../../components/Searchbar';

// Hooks
import { useEffect, useState } from 'react';

// styles
import { styles } from '../../styles/validator-styles.js';
import { Alert, Snackbar, Typography, Divider } from '@mui/material';
import useSWR from 'swr';
import { fetcherGetWithToken } from '@/helpers/FetchHelpers';

import { useUser } from '@/context/UserContext';

export async function getServerSideProps() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URI}/api/professor-subject/findByStatus?status=PENDING`);
    if (!res.ok) return { props: { data: [] } };
    const data = await res.json();
    return { props: { data } };
}

export default function Validator() {
    const [allTeachersSubjects, setAllTeachersSubjects] = useState([]);
    const [teachersSubjects, setTeachersSubjects] = useState([]);
    const [alert, setAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertSeverity, setAlertSeverity] = useState('');
    const user = useUser();
    const { data, isLoading, mutate } = useSWR([
        `${process.env.NEXT_PUBLIC_API_URI}/api/professor-subject/findByStatus?status=PENDING`,
        user.token],
        fetcherGetWithToken,
        { fallbackData: [] })

    useEffect(() => {
        if (user.id) {
            if (user.role === 'student') router.push('/student-landing');
            if (user.role === 'professor') router.push('/professor-landing');
        } else {
            router.push('/');
        }
    }, []);

    const handleSearch = (searchValue, filterValues) => {
        if (searchValue !== '' && filterValues.length === 0) {
            setTeachersSubjects(
                allTeachersSubjects.filter(
                    prevTeacherSubject =>
                        prevTeacherSubject.professor.firstName.toLowerCase().includes(searchValue.toLowerCase()) ||
                        prevTeacherSubject.professor.lastName.toLowerCase().includes(searchValue.toLowerCase())
                )
            );
        } else if (searchValue === '' && filterValues.length > 0) {
            setTeachersSubjects(allTeachersSubjects.filter(prevTeacherSubject => filterValues.includes(prevTeacherSubject.subject.name)));
        } else if (searchValue !== '' && filterValues.length > 0) {
            setTeachersSubjects(
                allTeachersSubjects.filter(
                    prevTeacherSubject =>
                        (prevTeacherSubject.professor.firstName.toLowerCase().includes(searchValue.toLowerCase()) ||
                            prevTeacherSubject.professor.lastName.toLowerCase().includes(searchValue.toLowerCase())) &&
                        filterValues.includes(prevTeacherSubject.subject.name)
                )
            );
        } else setTeachersSubjects(allTeachersSubjects);
    };

    const handleApprove = teacherSubject => {
        console.log(teacherSubject);
        fetch(`${process.env.NEXT_PUBLIC_API_URI}/api/professor-subject/approve`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${user.token}`
            },
            body: JSON.stringify({
                professorId: teacherSubject.professor.id,
                subjectIds: [teacherSubject.subject.id],
            }),
        }).then(res => {
            if (res.status === 200) {
                setAllTeachersSubjects(prevTeachers =>
                    prevTeachers.filter(prevTeacherSubject => {
                        if (
                            prevTeacherSubject.professor.id === teacherSubject.professor.id &&
                            prevTeacherSubject.subject.id === teacherSubject.subject.id
                        ) {
                            return false;
                        }
                        return true;
                    })
                );

                setTeachersSubjects(prevTeachers =>
                    prevTeachers.filter(prevTeacherSubject => {
                        if (
                            prevTeacherSubject.professor.id === teacherSubject.professor.id &&
                            prevTeacherSubject.subject.id === teacherSubject.subject.id
                        ) {
                            return false;
                        }
                        return true;
                    })
                );
                setAlertSeverity('success');
                setAlertMessage(`${teacherSubject.professor.firstName}: ${teacherSubject.subject.name} has been approved!`);
            } else {
                setAlertSeverity('error');
                setAlertMessage(`${teacherSubject.professor.firstName}: ${teacherSubject.subject.name} approval failed!`);
            }
        });
        setAlert(true);
    };

    const handleReject = teacherSubject => {
        fetch(`${process.env.NEXT_PUBLIC_API_URI}/api/professor-subject/reject`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${user.token}`
            },
            body: JSON.stringify({
                professorId: teacherSubject.professor.id,
                subjectIds: [teacherSubject.subject.id],
            }),
        }).then(res => {
            if (res.status === 200) {
                setAllTeachersSubjects(prevTeachers =>
                    prevTeachers.filter(prevTeacherSubject => {
                        if (
                            prevTeacherSubject.professor.id === teacherSubject.professor.id &&
                            prevTeacherSubject.subject.id === teacherSubject.subject.id
                        ) {
                            return false;
                        }
                        return true;
                    })
                );

                setTeachersSubjects(prevTeachers =>
                    prevTeachers.filter(prevTeacherSubject => {
                        if (
                            prevTeacherSubject.professor.id === teacherSubject.professor.id &&
                            prevTeacherSubject.subject.id === teacherSubject.subject.id
                        ) {
                            return false;
                        }
                        return true;
                    })
                );
                setAlertSeverity('success');
                setAlertMessage(`${teacherSubject.professor.firstName}: ${teacherSubject.subject.name} has been rejected!`);
            } else {
                setAlertSeverity('error');
                setAlertMessage(`${teacherSubject.professor.firstName}: ${teacherSubject.subject.name} rejection failed!`);
            }
            setAlert(true);
        });
    };

    return (
        <div style={styles.container}>
            <Typography variant='h4'>Professor Validator</Typography>
            <Divider />
            <div style={{ paddingBlock: '1rem' }} />
            <Searchbar search={handleSearch} />
            <div style={styles.divPadding} />
            <TeachersTable
                isLoading={isLoading}
                data={teachersSubjects}
                approve={handleApprove}
                reject={handleReject}
            />

            <Snackbar
                open={alert}
                autoHideDuration={3000}
                onClose={() => setAlert(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'top' }}
            >
                <Alert severity={alertSeverity}>{alertMessage}</Alert>
            </Snackbar>
        </div>
    );
}
