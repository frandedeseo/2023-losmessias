// components
import TeachersTable from './components/TeachersTable';
import Searchbar from './components/Searchbar';

// styles
import { styles } from './styles.js';
import { useState } from 'react';
import Layout from '@/components/ui/Layout';

export async function getServerSideProps() {
    const res = await fetch('http://localhost:8080/api/professor-subject/findByStatus?status=PENDING');
    const data = await res.json();
    return { props: { data } };
}

export default function Validator({ data }) {
    const [allTeachersSubjects, setAllTeachersSubjects] = useState(data);
    const [teachersSubjects, setTeachersSubjects] = useState(data);

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
        fetch('http://localhost:8080/api/professor-subject/approve', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
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
            } else {
                console.log('error status = ' + res.status);
            }
        });
    };

    const handleReject = teacherSubject => {
        fetch('http://localhost:8080/api/professor-subject/reject', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
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
            } else {
                console.log('error status = ' + res.status);
            }
        });
    };

    return (
        <Layout>
            <div style={styles.container}>
                <Searchbar search={handleSearch} />
                <div style={styles.divPadding} />
                <TeachersTable data={teachersSubjects} approve={handleApprove} reject={handleReject} />
            </div>
        </Layout>
    );
}
