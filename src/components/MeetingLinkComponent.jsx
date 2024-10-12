import VideoCall from '@mui/icons-material/VideoCall';
import { Typography, Link, Grid, Card, CardContent, List, ListItem, ListItemIcon } from '@mui/material';
import useWindowSize from '@/hooks/useWindowSize';

const MeetingLinkComponent = ({ googleMeetLink }) => {
    const windowSize = useWindowSize();
    return (
        googleMeetLink && (
            <Card
                sx={
                    windowSize.width > 500
                        ? { marginTop: '10px', marginLeft: '140px', maxWidth: 491, paddingTop: 2, paddingBottom: 1, paddingLeft: '16px' }
                        : { marginTop: '10px', maxWidth: 491, paddingTop: 2, paddingBottom: 1, paddingLeft: '16px' }
                }
            >
                <Grid container direction='row' justifyContent='flex-start' alignItems='flex-start'>
                    <Grid item sx={{ minWidth: '56px' }}>
                        <VideoCall color='primary' />
                    </Grid>
                    <Grid item>
                        <Typography variant='body1' color='text.secondary'>
                            {`Join the Meeting:   `}
                            <Link href={googleMeetLink} target='_blank' style={{ color: 'text.secondary' }}>
                                {googleMeetLink}
                            </Link>
                        </Typography>
                    </Grid>
                </Grid>
            </Card>
        )
    );
};
export default MeetingLinkComponent;
