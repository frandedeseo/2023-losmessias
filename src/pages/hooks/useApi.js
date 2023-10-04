// React
import { useState } from 'react';

export function useApi() {
    const [data, setData] = useState([]);
    const [error, setError] = useState("");

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
        fetch('http://localhost:8080/api/v1/registration', requestOptions)
            .then(response => response.json())
            .then(json => {
                alert(json.status);
            
                if (json.status=="200"){
                    return json;
                }
                throw new Error (json.message);
            })
            .catch(res => {
                alert(res);
                setError(res);
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

    const addProfessorLecture = request => {
        fetch(
            `http://localhost:8080/api/professor-subject/createAssociation?professorId=${request.professorId}&subjectId=${request.subjectId}`,
            { method: 'POST' }
        ).catch(error => {
                console.log(error);
        });
    };

    const validateEmailForPasswordChange = request => {

        fetch(`http://localhost:8080/api/v1/loadEmailForPasswordChange?email=${request.email}`,
            { method: 'POST' })
            .then(response => response.json())
            .then(json => {
                if (json.status=="200"){
                    setData(json);
                }
                throw new Error (json.message);
            })
            .catch(res => {
                setError(res);
            });
    };

    const changePassword = request => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: request.email,
                password: request.password,
            }),
        };

        fetch(`http://localhost:8080/api/v1/changePassword`, requestOptions)
            .then(response => {
                    setData(response);
                
                throw new Error (json.message);
            })
            .catch(res => {
                setError(res);
            });
    };

    

    return {
        data,
        error,
        getHomePageStudent,
        getHomePageTeacher,
        sendRequestForRegistration,
        sendRequestForLogIn,
        getSubjects,
        addProfessorLecture,
        validateEmailForPasswordChange,
        changePassword
    };
}
