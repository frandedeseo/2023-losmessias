import { Menu as MenuIcon } from '@mui/icons-material';
import { AppBar, Box, IconButton, Toolbar, Typography } from '@mui/material';
import { useState } from 'react';
import TemporaryDrawer from './TemporaryDrawer';
import { useUser } from '@/context/UserContext';

export default function SearchAppBar() {
    const [menuIsOpen, setMenuIsOpen] = useState(false);
    const user = useUser();

    const toggleDrawer = () => {
        setMenuIsOpen(!menuIsOpen);
    };

    if (user.authenticated) {
        return (
            <Box sx={{ flexGrow: 1 }}>
                <AppBar position='static'>
                    <Toolbar>
                        <IconButton
                            size='large'
                            edge='start'
                            color='inherit'
                            aria-label='open drawer'
                            sx={{ mr: 2 }}
                            onClick={toggleDrawer}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography variant='h6' noWrap component='div'>
                            Leherer
                        </Typography>
                    </Toolbar>
                </AppBar>
                <TemporaryDrawer toggleDrawer={toggleDrawer} menuIsOpen={menuIsOpen} />
            </Box>
        );
    }
}
