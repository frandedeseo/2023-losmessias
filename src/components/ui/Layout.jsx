import { SnackbarProvider } from 'notistack';
import SearchAppBar from './SearchAppBar';
import { UserProvider } from '@/context/UserContext';

export default function Layout({ children }) {
    return (
        <UserProvider>
            <SnackbarProvider>
                <SearchAppBar />
                <main>{children}</main>
            </SnackbarProvider>
        </UserProvider>
    );
}
