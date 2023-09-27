// React
import { useState } from 'react';

export function useApi() {
    const [data, setData] = useState(null);

    const getHomePageStudent = () => {
        return fetch('https://localhost:8080/student')
            .then((response) => response.json())
            .then((json) => {
                setData(json);
            })
            .catch((error) => {
                console.log(error);
            })
    }
    const getHomePageTeacher = () => {
        return fetch('https://localhost:8080/teacher')
            .then((response) => response.json())
            .then((json) => {
                setData(json);
            })
            .catch((error) => {
                console.log(error);
            })
    }

    const sendRequestForRegistration = (request) => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                "firstName": request.firstName,
                "lastName": request.lastName,
                "email": request.email,
                "password": request.password,
                "role": request.role
            })
        };
        alert(requestOptions.body);
        fetch('https://localhost:8080/api/v1/registration', requestOptions)
            .then((response) => response.json())
            .then((json) => {
                alert(json);
                setData(json);
            })
            .catch((error) => {
                console.log(error);
            })
    }
    
    const sendRequestForLogIn = (request) => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                "email": request.email,
                "password": request.password
            })
        };
        fetch('https://localhost:8080/login', requestOptions)
            .then((response) => response.json())
            .then((json) => {
                setData(json);
            })
            .catch((error) => {
                console.log(error);
            })
    }

    return { data, getHomePageStudent, getHomePageTeacher, sendRequestForRegistration };
}

