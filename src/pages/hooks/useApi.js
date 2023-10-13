// React
import { useRouter } from 'next/router';
import { useState } from 'react';
import jwt_decode from "jwt-decode";
import { useUserDispatch } from '@/context/UserContext';


export function useApi() {
    const [alertState, setAlertState] = useState({severity: "", message: ""});
    const router = useRouter();
    const [error, setError] = useState("");
    const [data, setData] = useState([]);
    const [open, setOpen] = useState(false);
    const dispatch = useUserDispatch();

    const showAlert = (response) => {
        var severity;
        if (response.status == 200){
            severity="success";
        }else{
            severity="error";
        }
        setAlertState({severity: severity, message: response.message})
        setOpen(true);
        //response.json().then(json => setMessage(json.message));
    }

    const getTokenValues = token => {
        const decoded = jwt_decode(token);
        const id = decoded.id;
        const email = decoded.sub;
        const role = decoded.role.toLowerCase();
        dispatch({ type: 'login', payload: { id: id, token: token, role: role } });
        if (role=="professor"){
            router.push("http://localhost:3000/professor-landing");
        }else if (role=="student"){
            router.push("http://localhost:3000/student-landing");
        }else{
            router.push("http://localhost:3000/admin-landing");
        }
    }
    
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
        fetch('http://localhost:8080/api/registration', requestOptions)
            .then(response => {
            
                if (response.status!=200){
                    showAlert({message: "Email is already taken", status: 500});
                }else{
                    showAlert({message: "We have sent you an email. Please confirm email adress", status: 200});
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
        fetch('http://localhost:8080/api/registration-professor', requestOptions)
            .then(response => {
                if (response.status==200){
                    showAlert({message: "We have sent you an email. Please confirm email adress", status: 200});
                }
            })
    };
    const sendRequestForLogIn = ( request ) => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: request.email,
                password: request.password,
            }),
        };
        fetch('http://localhost:8080/api/authentication', requestOptions)
            .then(response => {
                console.log(response.status);
                if (response.status===200){
                    return response.json();
                }else{
                    throw new Error();
                }
            })
            .then(json => {getTokenValues(json.token)})
            .catch(error => {
                showAlert({message: "Error Log In", status: 403})
                setError(error);
            });
    };

    const getSubjects = () => {
        const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' ,
                    'Authentication' : `Bearer ${this.state.token}`
            }
        };
        fetch('http://localhost:8080/api/subject/all', requestOptions)
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

        fetch(`http://localhost:8080/api/loadEmailForPasswordChange?email=${request.email}`,
            { method: 'POST' })
            .then(response => {
                if (response.status==200){
                    showAlert({message: "Email has been sent for validation", status: 200});
                    return true;
                }else{
                    showAlert({message: "Email not exists", status: 500});
                    return false;
                }

            })

    };

    const validateEmailNotTaken = async request => {
        try {
            let response = await fetch(`http://localhost:8080/api/validate-email?email=${request.email}`, { method: 'POST' })
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
    
    const confirmToken = token => {
        fetch(`http://localhost:8080/api/registration/confirm?token=${token}`)
        .then(response => {
            console.log(response.status);
            if (response.status===200){
                return response.json();
            }else{
                throw new Error();
            }
        })
        .then(json => {getTokenValues(json.token)})
        .catch(error => {
            showAlert({message: "The token was not validated", status: 403});
            setError(error);
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

        fetch(`http://localhost:8080/api/changePassword`, requestOptions)
            .then(response => {
                if (response.status === 200) {
                    router.push("http://localhost:3000");
                }
            })
            .catch(res => {
                console.log(res);
            });
    };

    

    return {
        data,
        error,
        setError,
        alertState,
        setAlertState,
        open,
        showAlert,
        setOpen,
        sendRequestForRegistration,
        sendRequestForLogIn,
        getSubjects,
        addProfessorLecture,
        validateEmailForPasswordChange,
        changePassword,
        confirmTokenForgotPassword,
        confirmToken,
        validateEmailNotTaken,
        sendRequestForRegistrationProfessor,
        getStudentById
    };
}
