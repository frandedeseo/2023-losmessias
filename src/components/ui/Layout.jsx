import { Box, ThemeProvider } from '@mui/material';
import { SnackbarProvider } from 'notistack';
import SearchAppBar from './SearchAppBar';
import { UserProvider } from '@/context/UserContext';

export default function Layout({ title, children }) {
    // (buttonAction, canBack, handleRedirect)
    return (
        // <ThemeProvider>
        <UserProvider>
            <SnackbarProvider>
                <SearchAppBar />
                <main>{children}</main>
            </SnackbarProvider>
        </UserProvider>
        // </ThemeProvider>
    );
}
