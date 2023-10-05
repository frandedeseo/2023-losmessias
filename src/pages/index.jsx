// Components
// import StudentsLandingPage from '@/pages/student-landing';
// import ProfessorLandingPage from './professor-landing';
import { useUser, useUserDispatch } from '@/context/UserContext';
import { useEffect, useState } from 'react';
import TopNav from './TopNav';
import Page from './sign-up/Page';
import PersonalData from './personal-data';
import { useApi } from './hooks/useApi';

export default function Home({ data, subjects }) {
    const [logInForm, setLogInForm] = useState(false);
    const [signUpForm, setSignUpForm] = useState(true);
    const [transferList, setTransferList] = useState(false);
    const fetcher = async (url) => {
        try {
            const res = await fetch(url);
            return res.json();
        } catch (error) {
            console.log(error);
        }
    }
    const dispatch = useUserDispatch();
    useEffect(() => {
        dispatch({
            type: "login",
            payload: {
                id: 1,
                authenticated: true,
                role: "student"
            }
        });
    }, [])

    return (
        <>
            {isLoading ?
                <h1>Loading...</h1> :
                <PersonalData />
            }
            {/* <Page
                transferList={transferList}
                setTransferList={setTransferList}
                logInForm={logInForm}
                setLogInForm={setLogInForm}
                signUpForm={signUpForm}
                setSignUpForm={setSignUpForm}
            /> */}
        </>
    );
    // const user = useUser();

    // return <StudentsLandingPage data={data} subjects={subjects} />;
    //return <ProfessorLandingPage />;
}
