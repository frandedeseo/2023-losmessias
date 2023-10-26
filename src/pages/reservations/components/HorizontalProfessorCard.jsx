import { Business, MailOutline, Phone } from '@mui/icons-material';
import { Card, CardActionArea, CardContent, CardMedia, List, ListItem, ListItemIcon, Skeleton, Typography } from '@mui/material';
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
                <CardContent sx={{ padding: 0, display: 'flex', alignSelf: 'start' }}>
                    <List>
                        <ListItem>
                            <ListItemIcon>
                                <PersonIcon />
                            </ListItemIcon>
                            {professor && professor.firstName !== undefined ? (
                                <Typography variant='body1' color='text.secondary'>
                                    {professor.firstName + ' ' + professor.lastName}
                                </Typography>
                            ) : (
                                <Skeleton
                                    variant="text"
                                    width={190}
                                    height={30}
                                />
                            )}
                        </ListItem>
                        <ListItem>
                            <ListItemIcon>
                                <MailOutline />
                            </ListItemIcon>
                            {professor && professor.email !== undefined ? (
                                <Typography variant='body1' color='text.secondary'>
                                    {professor.email}
                                </Typography>
                            ) : (
                                <Skeleton
                                    variant="text"
                                    width={190}
                                    height={30}
                                />
                            )}
                        </ListItem>
                    </List>
                    <List>
                        <ListItem>
                            <ListItemIcon>
                                <Phone />
                            </ListItemIcon>
                            {professor && professor.phone !== undefined ? (
                                <Typography variant='body1' color='text.secondary'>
                                    {professor.phone}
                                </Typography>
                            ) : (
                                <Skeleton
                                    variant="text"
                                    width={190}
                                    height={30}
                                />
                            )}
                        </ListItem>
                        <ListItem>
                            <ListItemIcon>
                                <Business />
                            </ListItemIcon>
                            {professor && professor.location !== undefined ? (
                                <Typography variant='body1' color='text.secondary'>
                                    {professor.location}
                                </Typography>
                            ) : (
                                <Skeleton
                                    variant="text"
                                    width={190}
                                    height={30}
                                />
                            )}
                        </ListItem>
                    </List>
                </CardContent>
            </CardActionArea>
        </Card>
    );
}
