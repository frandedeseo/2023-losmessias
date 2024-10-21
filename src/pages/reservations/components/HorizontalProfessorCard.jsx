import React from 'react';
import { Business, MailOutline, Phone, AccessTime, InsertDriveFile, SentimentSatisfiedAlt, Person } from '@mui/icons-material';
import {
    Card,
    CardContent,
    List,
    ListItem,
    ListItemIcon,
    Rating,
    Skeleton,
    Tooltip,
    Typography,
    Box,
    Avatar,
    Chip,
    useMediaQuery,
    useTheme,
} from '@mui/material';
import { styled } from '@mui/system';

const StyledCard = styled(Card)({
    overflow: 'visible',
    transition: 'transform 0.3s, box-shadow 0.3s',
    '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: '0 8px 16px 0 rgba(0,0,0,0.2)',
    },
});

const IconWrapper = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: theme.spacing(1),
}));

const InfoItem = ({ icon, text, loading }) => (
    <ListItem>
        <ListItemIcon>{icon}</ListItemIcon>
        {loading ? (
            <Skeleton variant='text' width={190} height={30} />
        ) : (
            <Typography variant='body2' color='text.secondary'>
                {text}
            </Typography>
        )}
    </ListItem>
);

export default function HorizontalProfessorCard({ professor }) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const loading = !professor;
    const avatarUrl =
        professor && professor.sex === 'FEMALE'
            ? 'https://cdn1.vectorstock.com/i/1000x1000/38/15/foreign-language-woman-teacher-icon-flat-style-vector-36033815.jpg'
            : 'https://www.w3schools.com/howto/img_avatar.png';

    const DesktopLayout = () => (
        <Box sx={{ display: 'flex', gap: 1 }}>
            {' '}
            {/* Reduced gap */}
            <StyledCard sx={{ flex: 1, minWidth: '500px' }}>
                {professor && professor.feedbackReceived && (
                    <Box sx={{ display: 'flex', p: 1 }}>
                        {' '}
                        {/* Reduced padding */}
                        <Avatar src={avatarUrl} alt='Professor' sx={{ width: 80, height: 80, mr: 1 }} /> {/* Reduced size */}
                        <Box sx={{ p: 1 }}>
                            <Typography variant='h6'>
                                {loading ? <Skeleton width={150} /> : `${professor.firstName} ${professor.lastName}`}
                            </Typography>
                            <Chip
                                icon={<Person />}
                                label={loading ? <Skeleton width={60} /> : professor ? professor.role : ''}
                                size='small'
                                color='primary'
                                variant='outlined'
                            />
                        </Box>
                        <CardContent sx={{ flex: 1, p: 0 }}>
                            <List dense>
                                <InfoItem icon={<MailOutline />} text={professor ? professor.email : ''} loading={loading} />
                                <InfoItem icon={<Phone />} text={professor ? professor.phone : ''} loading={loading} />
                                <InfoItem icon={<Business />} text={professor ? professor.location : ''} loading={loading} />
                            </List>
                        </CardContent>
                    </Box>
                )}
            </StyledCard>
            <StyledCard sx={{ flex: 1, minWidth: '122px' }}>
                {professor && professor.feedbackReceived && (
                    <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
                            <Rating
                                precision={0.25}
                                value={professor.feedbackReceived ? parseFloat(professor.feedbackReceived.avgRating) || 0 : 0}
                                max={3}
                                size='large'
                                readOnly
                            />
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-around' }}>
                            {[
                                {
                                    icon: <AccessTime />,
                                    value: professor.feedbackReceived ? professor.feedbackReceived.sumPunctuality : 0,
                                    tooltip: 'Is always on time',
                                },
                                {
                                    icon: <InsertDriveFile />,
                                    value: professor.feedbackReceived ? professor.feedbackReceived.sumMaterial : 0,
                                    tooltip:
                                        professor && professor.role && professor.role.toLowerCase() === 'student'
                                            ? 'Does the homework'
                                            : 'Has extra material to practice',
                                },
                                {
                                    icon: <SentimentSatisfiedAlt />,
                                    value: professor.feedbackReceived ? professor.feedbackReceived.sumPolite : 0,
                                    tooltip:
                                        professor && professor.role && professor.role.toLowerCase() === 'student'
                                            ? 'Pays attention and listens'
                                            : 'Is respectful and patient',
                                },
                            ].map((item, index) => (
                                <Tooltip key={index} title={item.tooltip}>
                                    <IconWrapper>
                                        {item.icon}
                                        <Typography variant='body2'>{loading ? <Skeleton width={20} /> : item.value}</Typography>
                                    </IconWrapper>
                                </Tooltip>
                            ))}
                        </Box>
                    </CardContent>
                )}
            </StyledCard>
        </Box>
    );

    const MobileLayout = () => (
        <StyledCard sx={{ width: '100%' }}>
            {professor && professor.feedbackReceived && (
                <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Avatar src={avatarUrl} alt='Professor' sx={{ width: 60, height: 60, mr: 2 }} />
                        <Box>
                            <Typography variant='h6'>
                                {loading ? <Skeleton width={150} /> : `${professor.firstName} ${professor.lastName}`}
                            </Typography>
                            <Chip
                                icon={<Person />}
                                label={loading ? <Skeleton width={60} /> : professor ? professor.role : ''}
                                size='small'
                                color='primary'
                                variant='outlined'
                            />
                        </Box>
                    </Box>
                    <List dense>
                        <InfoItem icon={<MailOutline />} text={professor ? professor.email : ''} loading={loading} />
                        <InfoItem icon={<Phone />} text={professor ? professor.phone : ''} loading={loading} />
                        <InfoItem icon={<Business />} text={professor ? professor.location : ''} loading={loading} />
                    </List>
                    <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
                        <Rating
                            precision={0.5}
                            value={professor.feedbackReceived ? parseFloat(professor.feedbackReceived.avgRating) : 0}
                            max={3}
                            size='large'
                            readOnly
                        />
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-around' }}>
                        {[
                            {
                                icon: <AccessTime />,
                                value: professor.feedbackReceived ? professor.feedbackReceived.sumPunctuality : 0,
                                tooltip: 'Is always on time',
                            },
                            {
                                icon: <InsertDriveFile />,
                                value: professor.feedbackReceived ? professor.feedbackReceived.sumMaterial : 0,
                                tooltip:
                                    professor && professor.role && professor.role.toLowerCase() === 'student'
                                        ? 'Do the homework'
                                        : 'Has extra material to practice',
                            },
                            {
                                icon: <SentimentSatisfiedAlt />,
                                value: professor.feedbackReceived ? professor.feedbackReceived.sumPolite : 0,
                                tooltip:
                                    professor && professor.role && professor.role.toLowerCase() === 'student'
                                        ? 'Pays attention and listens'
                                        : 'Is respectful and patient',
                            },
                        ].map((item, index) => (
                            <Tooltip key={index} title={item.tooltip}>
                                <IconWrapper>
                                    {item.icon}
                                    <Typography variant='body2'>{loading ? <Skeleton width={20} /> : item.value}</Typography>
                                </IconWrapper>
                            </Tooltip>
                        ))}
                    </Box>
                </CardContent>
            )}
        </StyledCard>
    );

    return isMobile ? <MobileLayout /> : <DesktopLayout />;
}
