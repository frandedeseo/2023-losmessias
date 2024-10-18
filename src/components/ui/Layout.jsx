import { useContext, useEffect, useState } from 'react';
import { SnackbarProvider } from 'notistack';
import SearchAppBar from './SearchAppBar';
import { CircularProgress, Box } from '@mui/material';
import { useUser } from '@/context/UserContext';

export default function Layout({ children }) {
    const user = useUser(); // Get user from context
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            setLoading(false); // Stop loading when user is loaded
        }
    }, [user]);

    return (
        <SnackbarProvider>
            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                    <CircularProgress />
                </Box>
            ) : (
                <>
                    <SearchAppBar />
                    <main>{children}</main>
                </>
            )}
        </SnackbarProvider>
    );
}
