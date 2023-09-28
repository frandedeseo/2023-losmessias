import { useState } from 'react';
import Page from './sign-up/Page';
import TopNav from './TopNav';
import TransferList from './sign-up/TransferList';

export default function Home() {
    const [logInForm, setLogInForm] = useState(false);
    const [signUpForm, setSignUpForm] = useState(true);
    const [transferList, setTransferList] = useState(false);

    return (
        <>
            <TopNav setLogInForm={setLogInForm} setSignUpForm={setSignUpForm} setTransferList={setTransferList}></TopNav>
            <Page
                transferList={true}
                setTransferList={setTransferList}
                logInForm={logInForm}
                setLogInForm={setLogInForm}
                signUpForm={signUpForm}
                setSignUpForm={setSignUpForm}
            ></Page>
        </>
    );
}
