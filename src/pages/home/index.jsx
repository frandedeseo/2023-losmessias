import Layout from "@/components/ui/Layout";
import SearchAppBar from "@/components/ui/SearchAppBar";
import { Box, Snackbar, ThemeProvider, Typography } from "@mui/material";

export default function () {
    return (
        <Layout>
            <Box>
                <Typography variant="h5">Goodbye, world!</Typography>
            </Box>
        </Layout>
    )
}