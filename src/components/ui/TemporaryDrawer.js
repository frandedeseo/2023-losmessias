import { AutoStories, HomeMaxOutlined, Person } from '@mui/icons-material';
import { Box, Divider, Drawer, List, ListItem, ListItemButton, ListItemText, Stack, Typography } from '@mui/material';
import router from 'next/router';

export default function TemporaryDrawer({ toggleDrawer, menuIsOpen }) {
    const handleRedirect = href => {
        toggleDrawer();
        router.push(href);
    };

    const drawerItems = [
        {
            href: '/',
            icon: <HomeMaxOutlined />,
            primary: 'Home',
        },
        // {
        //     href: "/home",
        //     icon: <Person />,
        //     primary: "Professors"
        // },
        // {
        //     href: "/home",
        //     icon: <AutoStories />,
        //     primary: "Courses"
        // }
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
