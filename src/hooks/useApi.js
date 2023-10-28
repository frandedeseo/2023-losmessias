// React
import { useRouter } from 'next/router';
import { useState } from 'react';
import jwt_decode from "jwt-decode";
import { useUserDispatch } from '@/context/UserContext';


export const useApi = () => {
    const [alertState, setAlertState] = useState({ severity: "", message: "" });
    const router = useRouter();
    const [error, setError] = useState("");
    const [data, setData] = useState([]);
    const [open, setOpen] = useState(false);
    const dispatch = useUserDispatch();

    const showAlert = (response) => {
        var severity;
        if (response.status == 200) {
            severity = "success";
        } else {
            severity = "error";
        }
        setAlertState({ severity: severity, message: response.message })
        setOpen(true);
        //response.json().then(json => setMessage(json.message));
    }

    const getTokenValues = token => {
        const loggedInUser = localStorage.getItem("user");
        if (loggedInUser != null) {
            console.log(loggedInUser);
            throw Error("User already logged in");
        } else {
            const decoded = jwt_decode(token);
            const id = decoded.id;
            const firstName = decoded.name;
            const lastName = decoded.surname;
            const email = decoded.sub;
            const role = decoded.role.toLowerCase();
            console.log(lastName);
            dispatch({ type: 'login', payload: { id: id, token: token, role: role, email: email, firstName: firstName, lastName: lastName } });
            if (role == "professor") {
                router.push("/professor-landing");
            } else if (role == "student") {
                router.push("/student-landing");
            } else {
                router.push("/admin-landing");
            }
        }
    }

    const sendRequestForRegistration = (request, setLoading) => {
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
        setLoading(true);
        fetch(`${process.env.NEXT_PUBLIC_API_URI}/api/registration`, requestOptions)
            .then(response => {
                if (response.status != 200) {
                    showAlert({ message: "Email is already taken", status: 500 });
                } else {
                    showAlert({ message: "We have sent you an email. Please confirm email adress", status: 200 });
                    router.push(`/${request.role}-landing`);
                }
            }).finally(() => {
                setLoading(false);
            });
    };

    const sendRequestForRegistrationProfessor = (request, subjects, setIsProcessing) => {
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
        setIsProcessing(true);
        fetch(`${process.env.NEXT_PUBLIC_API_URI}/api/registration-professor`, requestOptions)
            .then(response => {
                if (response.status == 200) {
                    showAlert({ message: "We have sent you an email. Please confirm email adress", status: 200 });
                }
            }).finally(() => {
                setIsProcessing(false);
            });
    };
    const sendRequestForLogIn = (request, setIsLoading) => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: request.email,
                password: request.password,
            }),
        };
        setIsLoading(true);
        fetch(`${process.env.NEXT_PUBLIC_API_URI}/api/authentication`, requestOptions)
            .then(response => {
                console.log(response.status);
                console.log(response);
                if (response.status === 200) {
                    return response.json();
                } else {
                    throw new Error();
                }
            })
            .then(json => { getTokenValues(json.token) })
            .catch(error => {
                console.log(error);
                showAlert({ message: "Error Log In", status: 403 })
                setError(error);
            }).finally(() => {
                setIsLoading(false);
            });
    };

    const getSubjects = () => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authentication': `Bearer ${this.state.token}`
            }
        };
        fetch(`${process.env.NEXT_PUBLIC_API_URI}/api/subject/all`, requestOptions)
            .then(response => response.json())
            .then(json => {
                setData(json);
            })
            .catch(error => {
                console.log(error);
            });
    };

    const getStudentById = (id) => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authentication': `Bearer ${this.state.token}`
            }
        };
        fetch(`${process.env.NEXT_PUBLIC_API_URI}/api/student/` + id, requestOptions)
            .then(response => response.json())
            .then(json => {
                setData(json);
            })
            .catch(error => {
                console.log(error);
            });
    }

    const addProfessorLecture = request => {
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authentication': `Bearer ${this.state.token}`
            }
        };
        fetch(
            `${process.env.NEXT_PUBLIC_API_URI}/api/professor-subject/createAssociation?professorId=${request.professorId}&subjectId=${request.subjectId}`,
            requestOptions
        ).catch(error => {
            console.log(error);
        });
    };

    const validateEmailForPasswordChange = (request, setIsProcessing) => {
        setIsProcessing(true);
        fetch(`${process.env.NEXT_PUBLIC_API_URI}/api/loadEmailForPasswordChange?email=${request.email}`,
            { method: 'POST' })
            .then(response => {
                if (response.status == 200) {
                    showAlert({ message: "Email has been sent for validation", status: 200 });
                    return true;
                } else {
                    showAlert({ message: "Email not exists", status: 500 });
                    return false;
                }
            }).finally(() => {
                setIsProcessing(false);
            });

    };

    const validateEmailNotTaken = async request => {
        try {
            let response = await fetch(`${process.env.NEXT_PUBLIC_API_URI}/api/validate-email?email=${request.email}`, { method: 'POST' })
            let json = await response.json();
            console.log(response);
            if (response.status === 200) {
                return true;
            } else {
                showAlert({ message: "Email is already taken", status: 500 });
                return false;
            }
        } catch (error) {
            return false;
        }
    };

    const confirmTokenForgotPassword = token => {
        fetch(`${process.env.NEXT_PUBLIC_API_URI}/api/forgot_password/confirm?token=${token}`)
            .then(response => {
                showAlert(response);
            })
            .catch(res => {
                setError(res);
            });
    }

    const confirmToken = token => {
        if (token === null || token === undefined) return;
        console.log(token);
        fetch(`${process.env.NEXT_PUBLIC_API_URI}/api/registration/confirm?token=${token}`)
            .then(response => {
                console.log(response.status);
                if (response.status === 200) {
                    return response.json();
                } else {
                    throw new Error();
                }
            })
            .then(json => { getTokenValues(json.token) })
            .catch(error => {
                showAlert({ message: "The token was not validated", status: 403 });
                setError(error);
            });
    }
    const changePassword = (request, setIsProcessing) => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: request.email,
                password: request.password,
            }),
        };
        setIsProcessing(true);
        fetch(`${process.env.NEXT_PUBLIC_API_URI}/api/changePassword`, requestOptions)
            .then(response => {
                if (response.status === 200) {
                    router.push("/");
                }
            })
            .catch(res => {
                console.log(res);
            }).finally(() => {
                setIsProcessing(false);
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
