// React
import { useRouter } from 'next/router';
import { useState } from 'react';


export function useApi() {
    const [alertState, setAlertState] = useState([]);
    const router = useRouter();
    const [error, setError] = useState("");
    const [data, setData] = useState([]);
    const [open, setOpen] = useState(false);
    const [severity, setSeverity] = useState("");
    const [message, setMessage] = useState("");

    const showAlert = (response) => {
        var severity;
        if (response.status == 200){
            severity="success";
        }else{
            severity="error";
        }
        setOpen(true);
        setSeverity(severity);
        setMessage(response.message);
        //response.json().then(json => setMessage(json.message));
    }

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
                sex: request.sex,
                location: request.location,
                phone: request.phone
            }),
        };
        fetch('http://localhost:8080/api/v1/registration', requestOptions)
            .then(response => {
            
                if (response.status!=200){
                    showAlert({message: "Email is already taken", status: 500});
                }else{
                    location.assign('http://localhost:8080/login');
                }
            })
    };

    const sendRequestForRegistrationProfessor = (request, subjects) => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                firstName: request.firstName,
                lastName: request.lastName,
                email: request.email,
                password: request.password,
                role: request.role,
                sex: request.sex,
                location: request.location,
                phone: request.phone,
                subjects: subjects
            }),
        };
        fetch('http://localhost:8080/api/v1/registration-professor', requestOptions)
            .then(response => {
                if (response.status==200){
                    location.assign('http://localhost:8080/login');
                }
            })
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

    const validateEmailForPasswordChange = request => {

        fetch(`http://localhost:8080/api/v1/loadEmailForPasswordChange?email=${request.email}`,
            { method: 'POST' })
            .then(response => {
                if (response.status==200){
                    showAlert({message: "Email has been sent for validation", status: 200});
                }else{
                    showAlert({message: "Email not exists", status: 500});
                }

            })

    };

    const validateEmailNotTaken = async request => {
        try {
            let response = await fetch(`http://localhost:8080/api/v1/validate-email?email=${request.email}`, { method: 'POST' })
            let json = await response.json();
            console.log(response);
            if (response.status===200){
                return true;
            }else{
                showAlert({message: "Email is already taken", status: 500});
                return false;
            }
        }catch( error){
            return false;
        }
    };
    
    const confirmTokenForgotPassword = token => {
        fetch(`http://localhost:8080/api/forgot_password/confirm?token=${token}`)
        .then(response => {
            showAlert(response);
        })
        .catch(res => {
            setError(res);
        });
    }

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
                if (response.status === 200) {
                    location.assign('http://localhost:8080/login');
                }
            })
            .catch(res => {
                console.log(res);
            });
    };

    

    return {
        data,
        error,
        alertState,
        message,
        severity,
        open,
        showAlert,
        setOpen,
        getHomePageStudent,
        getHomePageTeacher,
        sendRequestForRegistration,
        sendRequestForLogIn,
        getSubjects,
        addProfessorLecture,
        validateEmailForPasswordChange,
        changePassword,
        confirmTokenForgotPassword,
        validateEmailNotTaken,
        sendRequestForRegistrationProfessor,
        getStudentById
    };
}
