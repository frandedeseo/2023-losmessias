import Calendar from '@/components/Calendar';
import { Typography } from '@mui/material';

export default function ProfessorLandingPage() {
    return (
        <>
            <Typography variant='h4' sx={{ margin: '2% 5%' }}>
                Hi, Gonzalo!
            </Typography>
            <Calendar selectedBlocks={[]} setSelectedBlocks={() => {}} />
        </>
    );
}
