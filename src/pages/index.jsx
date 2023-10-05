// Components
import { useState } from 'react';
import Page from './sign-up/Page';

export default function Home({ data, subjects }) {
    const [logInForm, setLogInForm] = useState(false);
    const [signUpForm, setSignUpForm] = useState(true);
    const [transferList, setTransferList] = useState(false);

    return (
        <>
            <Page
                transferList={transferList}
                setTransferList={setTransferList}
                logInForm={logInForm}
                setLogInForm={setLogInForm}
                signUpForm={signUpForm}
                setSignUpForm={setSignUpForm}
            />
        </>
    );

    // return <StudentsLandingPage data={data} subjects={subjects} />;
    //return <ProfessorLandingPage />;
}
