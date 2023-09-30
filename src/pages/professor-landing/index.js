import Calendar from '@/components/Calendar';
import { Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export async function getServerSideProps() {
    const res = await fetch('http://localhost:8080/api/professor/all');
    const data = await res.json();

    const subjectsRes = await fetch('http://localhost:8080/api/subject/all');
    const subjects = await subjectsRes.json();
    return { props: { data, subjects } };
}

export default function ProfessorLandingPage() {
    const router = useRouter()
    const [professor, setProfessor] = useState({})
    

    return (
        <>
            <Typography variant='h4' sx={{ margin: '2% 5%' }}>
                Hi, welcome back!
            </Typography>
            <Calendar selectedBlocks={[]} setSelectedBlocks={() => {}} />
        </>
    );
}
