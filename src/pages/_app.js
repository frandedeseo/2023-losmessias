import Layout from '@/components/ui/Layout';
import '@/styles/globals.css';
import { Box, CircularProgress } from '@mui/material';
import { ReservationProvider } from '@/context/ReservationContext';
import { ProfessorProvider } from '@/context/ProfessorContext';
import { UserProvider } from '@/context/UserContext';

export default function App({ Component, pageProps }) {
    return (
        <UserProvider>
            <ReservationProvider>
                <ProfessorProvider>
                    <Component {...pageProps} />
                </ProfessorProvider>
            </ReservationProvider>
        </UserProvider>
    );
}
