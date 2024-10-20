import VideoCall from '@mui/icons-material/VideoCall';
import { Typography, Link, Grid, Card, useTheme, useMediaQuery } from '@mui/material';
import { styled } from '@mui/system';

const StyledCard = styled(Card)({
    overflow: 'visible',
    transition: 'transform 0.3s, box-shadow 0.3s',
    '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: '0 8px 16px 0 rgba(0,0,0,0.2)',
    },
});

const MeetingLinkComponent = ({ googleMeetLink }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    return (
        googleMeetLink && (
            <StyledCard
                sx={{
                    width: 'calc(100% - 16px)',
                    padding: 1,
                }}
            >
                <Grid container alignItems='center' spacing={1}>
                    <Grid item>
                        <VideoCall color='primary' fontSize='large' />
                    </Grid>
                    <Grid item xs>
                        <Typography variant='body1' color='text.secondary'>
                            Join the Meeting:{' '}
                            <Link href={googleMeetLink} target='_blank' rel='noopener' color='primary'>
                                {googleMeetLink}
                            </Link>
                        </Typography>
                    </Grid>
                </Grid>
            </StyledCard>
        )
    );
};
export default MeetingLinkComponent;
