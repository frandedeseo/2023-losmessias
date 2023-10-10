// Components
import { useState } from 'react';
import Page from './sign-up/Page';
import TopNav from './TopNav';

export default function Home({ data, subjects }) {
    const [logInForm, setLogInForm] = useState(false);
    const [signUpForm, setSignUpForm] = useState(true);
    const [transferList, setTransferList] = useState(false);
    const [forgotPassword, setForgotPassword] = useState(false);

    return (
        <>
            <TopNav setLogInForm={setLogInForm} setSignUpForm={setSignUpForm} setTransferList={setTransferList} />
            <Page
                transferList={transferList}
                setTransferList={setTransferList}
                logInForm={logInForm}
                setLogInForm={setLogInForm}
                signUpForm={signUpForm}
                setSignUpForm={setSignUpForm}
                forgotPassword={forgotPassword}
                setForgotPassword={setForgotPassword}
            />
        </>
    );

    // return <StudentsLandingPage data={data} subjects={subjects} />;
    //return <ProfessorLandingPage />;
}
