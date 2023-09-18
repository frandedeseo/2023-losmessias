import LogIn from "./sign-up/LogIn";
import SignUp from "./sign-up/SignUp";
import Page from "./sign-up/Page";
import TopNav from "./TopNav";
import * as React from 'react';

export default function Home() {

    const [logInForm, setLogInForm] = React.useState(true);
    const [signUpForm, setSignUpForm] = React.useState(false);
    const [transferList, setTransferList] = React.useState(false);

    return (
        <>
            <TopNav setLogInForm={setLogInForm}  setSignUpForm={setSignUpForm} setTransferList={setTransferList}></TopNav>
            <Page transferList={transferList} setTransferList={setTransferList} logInForm={logInForm} setLogInForm={setLogInForm}  signUpForm={signUpForm} setSignUpForm={setSignUpForm}></Page>
        </>
    );
}
