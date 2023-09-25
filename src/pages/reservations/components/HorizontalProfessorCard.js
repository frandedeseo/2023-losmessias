import { Business, MailOutline, Phone } from '@mui/icons-material';
import { Card, CardActionArea, CardContent, CardMedia, List, ListItem, ListItemIcon, Typography } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';

export default function HorizontalProfessorCard({ professor }) {
    return (
        <Card>
            <CardActionArea sx={{ display: 'flex', justifyContent: 'start' }}>
                <CardMedia component='img' sx={{ width: 130 }} image='https://www.w3schools.com/howto/img_avatar.png' alt='Professor' />
                <CardContent sx={{ padding: 0, display: 'flex', alignSelf: 'start' }}>
                    <List>
                        <ListItem>
                            <ListItemIcon>
                                <PersonIcon />
                            </ListItemIcon>
                            <Typography variant='body1' color='text.secondary'>
                                {professor.name}
                            </Typography>
                        </ListItem>
                        <ListItem>
                            <ListItemIcon>
                                <MailOutline />
                            </ListItemIcon>
                            <Typography variant='body1' color='text.secondary'>
                                {professor.email}
                            </Typography>
                        </ListItem>
                    </List>
                    <List>
                        <ListItem>
                            <ListItemIcon>
                                <Phone />
                            </ListItemIcon>
                            <Typography variant='body1' color='text.secondary'>
                                {professor.phone}
                            </Typography>
                        </ListItem>
                        <ListItem>
                            <ListItemIcon>
                                <Business />
                            </ListItemIcon>
                            <Typography variant='body1' color='text.secondary'>
                                {professor.office}
                            </Typography>
                        </ListItem>
                    </List>
                </CardContent>
            </CardActionArea>
        </Card>
    );
}
