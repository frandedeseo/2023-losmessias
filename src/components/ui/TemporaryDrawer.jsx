import { useUser } from '@/context/UserContext';
import { AutoStories, HomeMaxOutlined, Person } from '@mui/icons-material';
import HomeIcon from '@mui/icons-material/Home';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import { Box, Divider, Drawer, List, ListItem, ListItemButton, ListItemText, Stack, Typography } from '@mui/material';
import router from 'next/router';

export default function TemporaryDrawer({ toggleDrawer, menuIsOpen }) {
    const handleRedirect = href => {
        toggleDrawer();
        router.push(href);
    };
    const user = useUser();

    const drawerItems = [
        {
            href: `/${user.role}-landing`,
            icon: <HomeIcon />,
            primary: 'Home',
        },
        user.role === 'student'
            ? {
                  href: '/professors',
                  icon: <PersonSearchIcon />,
                  primary: 'Professors',
              }
            : {},
        user.role !== 'admin'
            ? {
                  href: '/personal-data',
                  icon: <SettingsIcon />,
                  primary: 'Personal information',
              }
            : {
                  href: '/validator',
                  icon: <SettingsIcon />,
                  primary: 'Validator',
              },
        {
            href: '/logout',
            icon: <LogoutIcon />,
            primary: 'Log out',
        },
    ];

    const drawerItem = (href, icon, primary, key) => {
        //Agg seleccionado o no
        return (
            <ListItem key={key}>
                <ListItemButton style={{ borderRadius: '8px' }} onClick={() => handleRedirect(href)}>
                    {icon}
                    <ListItemText sx={{ ml: 3, mr: 6 }} primary={primary} />
                </ListItemButton>
            </ListItem>
        );
    };

    return (
        <Drawer anchor={'left'} open={menuIsOpen} onClose={toggleDrawer}>
            <Box>
                <Divider />
                <Stack direction={'column'} spacing={2} sx={{ m: 2, pt: 2 }} justifyContent={'start'} alignItems={'center'}>
                    <Typography variant={'h5'}>Leherer</Typography>
                    <Divider style={{ color: 'transparent', width: '100%' }} />
                    <List>
                        {
                            drawerItems.map((item, index) => drawerItem(item.href, item.icon, item.primary, index))
                            // filtrar por rol
                        }
                    </List>
                </Stack>
            </Box>
        </Drawer>
    );
}
