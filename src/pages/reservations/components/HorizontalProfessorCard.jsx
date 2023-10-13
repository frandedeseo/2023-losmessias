import { Business, MailOutline, Phone } from '@mui/icons-material';
import { Card, CardActionArea, CardContent, CardMedia, List, ListItem, ListItemIcon, Typography } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';

export default function HorizontalProfessorCard({ professor }) {
    return (
        <Card>
            <CardActionArea sx={{ display: 'flex', justifyContent: 'start' }}>
            {(professor.sex == "MALE") && <CardMedia component='img' height='140' image='https://www.w3schools.com/howto/img_avatar.png' alt='Professor' />}
            {(professor.sex == "FEMALE") && <CardMedia component='img' height='140' image='https://cdn1.vectorstock.com/i/1000x1000/38/15/foreign-language-woman-teacher-icon-flat-style-vector-36033815.jpg' alt='Professor' />}
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
            </CardActionArea>
        </Card>
    );
}
