import { Box, CircularProgress, Modal, Typography } from "@mui/material";

export default function LoadingModal({isOpen, message}) {
    return (
        <Modal open={isOpen}>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap', padding: 5, backgroundColor: "white", borderRadius: 4 }}>
                    <CircularProgress />
                    <Typography variant='h4' component='div' sx={{ mt: 2, mb: 2, ml: 2 }} color={'black'}>
                        {message}
                    </Typography>
                </Box>
            </div>
        </Modal>
    );
}