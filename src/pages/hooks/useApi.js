// React
import { useState } from 'react';

export function useApi() {
    const [data, setData] = useState([]);

    const getHomePageStudent = () => {
        return fetch('https://localhost:8080/student')
            .then(response => response.json())
            .then(json => {
                setData(json);
            })
            .catch(error => {
                console.log(error);
            });
    };

    const getHomePageTeacher = () => {
        return fetch('https://localhost:8080/teacher')
            .then(response => response.json())
            .then(json => {
                setData(json);
            })
            .catch(error => {
                console.log(error);
            });
    };

    const sendRequestForRegistration = request => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                firstName: request.firstName,
                lastName: request.lastName,
                email: request.email,
                password: request.password,
                role: request.role,
            }),
        };
        fetch('http://localhost:8080/api/v1/registration', requestOptions).then(res => {
            if (res.status != 200) {
                console.log('error status = ' + res.status);
            }
        });
    };

    const sendRequestForLogIn = () => {
        fetch('http://localhost:8080/login')
            .then(response => response.json())
            .then(json => {
                setData(json);
            })
            .catch(error => {
                console.log(error);
            });
    };

    const getSubjects = () => {
        fetch('http://localhost:8080/api/subject/all')
            .then(response => response.json())
            .then(json => {
                setData(json);
            })
            .catch(error => {
                console.log(error);
            });
    };

    const getStudentById = (id) => {
        fetch('http://localhost:8080/api/student/'+id)
            .then(response => response.json())
            .then(json => {
                setData(json);
            })
            .catch(error => {
                console.log(error);
            });
    }

    const addProfessorLecture = request => {
        fetch(
            `http://localhost:8080/api/professor-subject/createAssociation?professorId=${request.professorId}&subjectId=${request.subjectId}`,
            { method: 'POST' }
        ).catch(error => {
            console.log(error);
        });
    };

    return {
        data,
        getHomePageStudent,
        getHomePageTeacher,
        sendRequestForRegistration,
        sendRequestForLogIn,
        getSubjects,
        addProfessorLecture,
        getStudentById
    };
}
