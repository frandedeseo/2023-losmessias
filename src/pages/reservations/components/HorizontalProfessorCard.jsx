import { Business, MailOutline, Phone } from '@mui/icons-material';
import {
    Card,
    CardActionArea,
    CardContent,
    CardMedia,
    List,
    ListItem,
    ListItemIcon,
    Rating,
    Skeleton,
    Tooltip,
    Typography,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';

export default function HorizontalProfessorCard({ professor }) {
    console.log(professor.avgRating);
    const link =
        professor && professor.sex == 'FEMALE'
            ? 'https://cdn1.vectorstock.com/i/1000x1000/38/15/foreign-language-woman-teacher-icon-flat-style-vector-36033815.jpg'
            : 'https://www.w3schools.com/howto/img_avatar.png';
    return (
        <div style={{ display: 'flex', gap: 20 }}>
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
                                    <Skeleton variant='text' width={190} height={30} />
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
                                    <Skeleton variant='text' width={190} height={30} />
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
                                    <Skeleton variant='text' width={190} height={30} />
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
                                    <Skeleton variant='text' width={190} height={30} />
                                )}
                            </ListItem>
                        </List>
                    </CardContent>
                </CardActionArea>
            </Card>

            <Card>
                <CardContent>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <Rating name='read-only' precision={0.5} value={professor.avgRating} max={3} size='large' readOnly />
                    </div>
                    <div
                        style={{
                            marginTop: '1.5rem',
                            display: 'grid',
                            gridTemplateColumns: 'repeat(3, 1fr)',
                            gridGap: '10px',
                            gap: 10,
                            textAlign: 'center',
                            rowGap: 0,
                        }}
                    >
                        <Tooltip title='Is always on time'>
                            <AccessTimeIcon fontSize='large' sx={{ gridColumn: 1 / 3, row: 1 }} />
                        </Tooltip>

                        <Tooltip
                            title={professor?.role?.toLowerCase() === 'student' ? 'Do the homework' : 'Has extra material to practice'}
                        >
                            <InsertDriveFileIcon fontSize='large' sx={{ gridColumn: 1 / 3, row: 1 }} />
                        </Tooltip>

                        <Tooltip
                            title={
                                professor?.role?.toLowerCase() === 'student' ? 'Pays attention and listens' : 'Is respectful and patient'
                            }
                        >
                            <SentimentSatisfiedAltIcon fontSize='large' sx={{ gridColumn: 1 / 3, row: 1 }} />
                        </Tooltip>

                        <Typography sx={{ gridColumn: 1 / 3 }}>{professor.sumPunctuality}</Typography>
                        <Typography sx={{ gridColumn: 1 / 3 }}>{professor.sumMaterial}</Typography>
                        <Typography sx={{ gridColumn: 1 / 3 }}>{professor.sumPolite}</Typography>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
