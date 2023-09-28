// Components
import StudentsLandingPage from '@/pages/components/StudentLandinPage';
import ProfessorLandingPage from './components/ProfessorLandingPage';
import { useUser } from '@/context/UserContext';

export async function getServerSideProps() {
    const res = await fetch('http://localhost:8080/api/professor/all');
    const data = await res.json();

    const subjectsRes = await fetch('http://localhost:8080/api/subject/all');
    const subjects = await subjectsRes.json();
    return { props: { data, subjects } };
}

export default function Home({ data, subjects }) {
    //const user = useUser();

    return <StudentsLandingPage data={data} subjects={subjects} />;
    //return <ProfessorLandingPage />;
}
