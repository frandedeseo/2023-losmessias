// Components
import StudentsLandingPage from '@/pages/components/StudentLandinPage';
import ProfessorLandingPage from './components/ProfessorLandingPage';

export async function getServerSideProps() {
    const res = await fetch('http://localhost:8080/api/professor');
    const data = await res.json();

    const subjectsRes = await fetch('http://localhost:8080/api/subject');
    const subjects = await subjectsRes.json();
    return { props: { data, subjects } };
}

export default function Home({ data, subjects }) {
    //return <StudentsLandingPage data={data} subjects={subjects} />;
    return <ProfessorLandingPage />;
}
