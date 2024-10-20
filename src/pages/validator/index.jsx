// components
import TeachersTable from './components/TeachersTable';
import Searchbar from '../../components/Searchbar';

// Hooks
import { useEffect, useState } from 'react';

// styles
import { styles } from '../../styles/validator-styles.js';
import { Alert, Snackbar, Typography, Divider, Backdrop, CircularProgress } from '@mui/material';
import useSWR from 'swr';
import { fetcherGetWithToken } from '@/helpers/FetchHelpers';

import { useUser } from '@/context/UserContext';
import { useRouter } from 'next/router';
import Layout from '@/components/ui/Layout';

// export async function getServerSideProps() {
//     const res = await fetch(`${process.env.NEXT_PUBLIC_API_URI}/api/professor-subject/findByStatus?status=PENDING`);
//     if (!res.ok) return { props: { data: [] } };
//     const data = await res.json();
//     return { props: { data } };
// }

export default function Validator() {
    const [allTeachersSubjects, setAllTeachersSubjects] = useState([]);
    const [teachersSubjects, setTeachersSubjects] = useState([]);
    const [alert, setAlert] = useState(false);
    const [waitingForServer, setWaitingForServer] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertSeverity, setAlertSeverity] = useState('');
    const user = useUser();
    const router = useRouter();
    const { data, isLoading, mutate } = useSWR(
        [`${process.env.NEXT_PUBLIC_API_URI}/api/professor-subject/findByStatus?status=PENDING`, user.token],
        fetcherGetWithToken,
        { fallbackData: [] }
    );

    useEffect(() => {
        if (user.id) {
            setTeachersSubjects(data);
            setAllTeachersSubjects(data);
        }
    }, [data, user, router]);

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
        setWaitingForServer(true);
        fetch(`${process.env.NEXT_PUBLIC_API_URI}/api/professor-subject/approve`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${user.token}`,
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
                setAlertMessage(
                    `It has been approved successfully the subject ${teacherSubject.subject.name} for ${teacherSubject.professor.firstName}`
                );
            } else {
                setAlertSeverity('error');
                setAlertMessage(`${teacherSubject.professor.firstName}: ${teacherSubject.subject.name} Approval failed!`);
            }
            setWaitingForServer(false);
            setAlert(true);
        });
    };

    const handleReject = teacherSubject => {
        setWaitingForServer(true);
        fetch(`${process.env.NEXT_PUBLIC_API_URI}/api/professor-subject/reject`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${user.token}`,
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
                setAlertMessage(
                    `It has been rejected successfully the subject ${teacherSubject.subject.name} for ${teacherSubject.professor.firstName}`
                );
            } else {
                setAlertSeverity('error');
                setAlertMessage(`Rejection failed!`);
            }
            setWaitingForServer(false);
            setAlert(true);
        });
    };

    return (
        <Layout>
            <div style={styles.container}>
                <Typography variant='h4'>Professor Validator</Typography>
                <Divider />
                <div style={{ paddingBlock: '1rem' }} />
                <Searchbar search={handleSearch} />
                <div style={styles.divPadding} />
                <TeachersTable isLoading={isLoading} data={teachersSubjects} approve={handleApprove} reject={handleReject} />

                <Snackbar
                    open={alert}
                    autoHideDuration={3000}
                    onClose={() => setAlert(false)}
                    anchorOrigin={{ vertical: 'top', horizontal: 'top' }}
                >
                    <Alert severity={alertSeverity}>{alertMessage}</Alert>
                </Snackbar>
                <Backdrop open={waitingForServer} sx={{ color: '#fff', zIndex: 10000 }}>
                    <CircularProgress color='inherit' />
                </Backdrop>
            </div>
        </Layout>
    );
}
