import { Box, ThemeProvider } from "@mui/material";
import { SnackbarProvider } from "notistack";
import SearchAppBar from "./SearchAppBar";

export default function Layout({ title, children }) { // (buttonAction, canBack, handleRedirect)
    return (
        // <ThemeProvider>
        <SnackbarProvider>
            <SearchAppBar />
            <main>
                {children}
            </main>
        </SnackbarProvider>
        // </ThemeProvider>
    );
}