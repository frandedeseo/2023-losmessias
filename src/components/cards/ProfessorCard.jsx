import React from 'react';
import { AccessTime, Business, MailOutline, Phone, Person as PersonIcon } from '@mui/icons-material';
import {
    Card,
    CardActionArea,
    CardContent,
    CardMedia,
    Chip,
    List,
    ListItem,
    ListItemIcon,
    Rating,
    Typography,
    Box,
    Avatar,
    useTheme,
} from '@mui/material';
import { useRouter } from 'next/router';
import { styled } from '@mui/system';
import { getColor } from '@/utils/getColor';
import { useProfessor } from '@/context/ProfessorContext';

const StyledCard = styled(Card)(({ theme }) => ({
    maxWidth: 350,
    transition: 'transform 0.3s, box-shadow 0.3s',
    '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: '0 8px 16px 0 rgba(0,0,0,0.2)',
    },
}));

const StyledCardMedia = styled(CardMedia)({
    height: 140,
    position: 'relative',
});

const StyledAvatar = styled(Avatar)(({ theme }) => ({
    width: 120,
    height: 120,
    border: '4px solid #e0e0e0',
    position: 'absolute',
    left: '50%',
    transform: 'translateX(-50%)',
}));

const InfoItem = ({ icon, text }) => (
    <ListItem>
        <ListItemIcon>{icon}</ListItemIcon>
        <Typography variant='body2' color='text.secondary'>
            {text}
        </Typography>
    </ListItem>
);

export default function ProfessorCard({ professorId, name, email, phone, sex, office, subjects, rating, style }) {
    const { setProfessorId } = useProfessor();
    const router = useRouter();
    const theme = useTheme();

    const handleClick = () => {
        setProfessorId(professorId);
        router.push('/reservations');
    };

    const avatarUrl =
        sex === 'FEMALE'
            ? 'https://cdn1.vectorstock.com/i/1000x1000/38/15/foreign-language-woman-teacher-icon-flat-style-vector-36033815.jpg'
            : 'https://www.w3schools.com/howto/img_avatar.png';

    return (
        <StyledCard sx={style}>
            <CardActionArea onClick={handleClick} sx={{ height: '100%' }}>
                <StyledCardMedia>
                    <StyledAvatar src={avatarUrl} alt={name} />
                </StyledCardMedia>
                <CardContent sx={{ pt: 0 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
                        <Typography variant='h6' gutterBottom>
                            {name}
                        </Typography>
                        <Rating name='read-only' precision={0.5} value={rating} max={3} size='large' readOnly />
                    </Box>
                    <List>
                        <InfoItem icon={<MailOutline />} text={email} />
                        <InfoItem icon={<Phone />} text={phone} />
                        <InfoItem icon={<Business />} text={office} />
                    </List>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center', mt: 2 }}>
                        {subjects.map(subject => (
                            <Chip
                                key={subject.id}
                                label={subject.name}
                                size='small'
                                sx={{
                                    backgroundColor: getColor(subject.name),
                                    color: theme.palette.getContrastText(getColor(subject.name)),
                                }}
                            />
                        ))}
                    </Box>
                </CardContent>
            </CardActionArea>
        </StyledCard>
    );
}
