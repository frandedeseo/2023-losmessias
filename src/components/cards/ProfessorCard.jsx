import { AccessTime, Business, MailOutline, Phone } from '@mui/icons-material';
import {
    Card,
    CardActionArea,
    CardContent,
    CardMedia,
    Chip,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Rating,
    Typography,
} from '@mui/material';
import Link from 'next/link';
import PersonIcon from '@mui/icons-material/Person';
import { getColor } from '@/utils/getColor';

export default function ProfessorCard({ professorId, studentId, name, email, phone, sex, office, officeHours, image, style, subjects }) {
    const prepare_subjects = () => {
        return subjects.map(subject => subject.name).join('-');
    };

    return (
        <Card sx={{ maxWidth: 350, ...style }}>
            <Link
                href={{
                    pathname: '/reservations',
                    query: { professorId },
                }}
                style={{ textDecoration: 'none' }}
            >
                <CardActionArea>
                    {sex == 'MALE' && (
                        <CardMedia component='img' height='140' image='https://www.w3schools.com/howto/img_avatar.png' alt='Professor' />
                    )}
                    {sex == 'FEMALE' && (
                        <CardMedia
                            component='img'
                            height='140'
                            image='https://cdn1.vectorstock.com/i/1000x1000/38/15/foreign-language-woman-teacher-icon-flat-style-vector-36033815.jpg'
                            alt='Professor'
                        />
                    )}
                    <CardContent>
                        <ListItem sx={{ display: 'flex', justifyContent: 'center' }}>
                            <Rating name='read-only' precision={0.5} value={1.5} max={3} size='large' readOnly />
                        </ListItem>
                        <ListItem>
                            <ListItemIcon>
                                <PersonIcon />
                            </ListItemIcon>
                            <Typography variant='body1' color='text.secondary'>
                                {name}
                            </Typography>
                        </ListItem>
                        <List>
                            <ListItem>
                                <ListItemIcon>
                                    <MailOutline />
                                </ListItemIcon>
                                <Typography variant='body1' color='text.secondary'>
                                    {email}
                                </Typography>
                            </ListItem>
                            <ListItem>
                                <ListItemIcon>
                                    <Phone />
                                </ListItemIcon>
                                <Typography variant='body1' color='text.secondary'>
                                    {phone}
                                </Typography>
                            </ListItem>
                            <ListItem>
                                <ListItemIcon>
                                    <Business />
                                </ListItemIcon>
                                <Typography variant='body1' color='text.secondary'>
                                    {office}
                                </Typography>
                            </ListItem>

                            <ListItem sx={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                                {subjects.map(subject => (
                                    <Chip key={subject.id} label={subject.name} sx={{ backgroundColor: getColor(subject.name) }} />
                                ))}
                            </ListItem>
                        </List>
                    </CardContent>
                </CardActionArea>
            </Link>
        </Card>
    );
}
