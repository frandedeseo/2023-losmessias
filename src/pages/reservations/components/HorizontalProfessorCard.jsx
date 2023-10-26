import { Business, MailOutline, Phone } from '@mui/icons-material';
import { Card, CardActionArea, CardContent, CardMedia, List, ListItem, ListItemIcon, Typography } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';

export default function HorizontalProfessorCard({ professor }) {
    const link =
        professor && professor.sex == 'FEMALE'
            ? 'https://cdn1.vectorstock.com/i/1000x1000/38/15/foreign-language-woman-teacher-icon-flat-style-vector-36033815.jpg'
            : 'https://www.w3schools.com/howto/img_avatar.png';
    return (
        <Card>
            <CardActionArea sx={{ display: 'flex', justifyContent: 'start' }}>
                <CardMedia component='img' height='140' image={link} alt='Professor' />
                {professor ? (
                    <CardContent sx={{ padding: 0, display: 'flex', alignSelf: 'start' }}>
                        <List>
                            <ListItem>
                                <ListItemIcon>
                                    <PersonIcon />
                                </ListItemIcon>
                                <Typography variant='body1' color='text.secondary'>
                                    {professor.firstName + ' ' + professor.lastName}
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
                                    {professor.location}
                                </Typography>
                            </ListItem>
                        </List>
                    </CardContent>
                ) : (
                    <CardContent>
                        <Typography variant='body1' color='text.secondary'>
                            Loading...
                        </Typography>
                    </CardContent>
                )}
            </CardActionArea>
        </Card>
    );
}
