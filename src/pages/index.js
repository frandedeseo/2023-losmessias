// Components
// import StudentsLandingPage from '@/pages/student-landing';
// import ProfessorLandingPage from './professor-landing';
import { useUser } from '@/context/UserContext';
import { useState } from 'react';
import TopNav from './TopNav';
import Page from './sign-up/Page';

// export async function getServerSideProps() {
//     const res = await fetch('http://localhost:8080/api/professor/all');
//     const data = await res.json();

//     const subjectsRes = await fetch('http://localhost:8080/api/subject/all');
//     const subjects = await subjectsRes.json();
//     return { props: { data, subjects } };
// }

export default function Home({ data, subjects }) {
    const [logInForm, setLogInForm] = useState(false);
    const [signUpForm, setSignUpForm] = useState(true);
    const [transferList, setTransferList] = useState(false);

    return (
        <>
            {/* <TopNav setLogInForm={setLogInForm} setSignUpForm={setSignUpForm} setTransferList={setTransferList} /> */}
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
    const user = useUser();

    // return <StudentsLandingPage data={data} subjects={subjects} />;
    //return <ProfessorLandingPage />;
}
