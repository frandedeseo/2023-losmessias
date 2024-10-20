import React, { useState, useEffect } from 'react';
import { Box, Grid, CircularProgress, Backdrop } from '@mui/material';
import { useUser } from '@/context/UserContext';
import { useReservation } from '@/context/ReservationContext';
import MeetingLinkComponent from '@/components/MeetingLinkComponent';
import HorizontalProfessorCard from '../reservations/components/HorizontalProfessorCard';
import Chat from '@/components/Chat';
import Layout from '@/components/ui/Layout';

export default function ReservationChat() {
    const user = useUser();
    const { reservationId, userId } = useReservation();
    const [googleMeetLink, setGoogleMeetLink] = useState('');
    const [isLoadingContent, setIsLoadingContent] = useState(true);
    const [userInfo, setUserInfo] = useState({});

    useEffect(() => {
        if (user.id && reservationId && userId) {
            setIsLoadingContent(true);
            const requestOptions = {
                method: 'GET',
                headers: { Authorization: `Bearer ${user.token}` },
            };

            // Fetch reservation data
            fetch(`${process.env.NEXT_PUBLIC_API_URI}/api/reservation/${reservationId}`, requestOptions)
                .then(res => res.json())
                .then(json => {
                    setGoogleMeetLink(json.googleMeetLink);
                    setIsLoadingContent(false);
                });

            // Fetch user info
            const userEndpoint =
                user.role === 'student'
                    ? `${process.env.NEXT_PUBLIC_API_URI}/api/professor/${userId}`
                    : `${process.env.NEXT_PUBLIC_API_URI}/api/student/${userId}`;

            fetch(userEndpoint, requestOptions)
                .then(res => res.json())
                .then(json => {
                    setUserInfo(json);
                });
        }
    }, [user, reservationId, userId]);

    return (
        <Layout>
            <Box
                sx={{
                    width: '100%',
                    margin: '2rem auto',
                }}
            >
                {!isLoadingContent && (
                    <Grid container spacing={4}>
                        {/* Left Column */}
                        <Grid item xs={12} md='auto' sx={{ marginLeft: 5, marginRight: 5 }}>
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'flex-start',
                                    gap: 2,
                                }}
                            >
                                <HorizontalProfessorCard professor={userInfo} />
                                {googleMeetLink && <MeetingLinkComponent googleMeetLink={googleMeetLink} />}
                            </Box>
                        </Grid>

                        <Grid item xs={12} md='auto' sx={{ marginLeft: 'auto', marginRight: 5 }}>
                            <Box
                                sx={{
                                    height: '100%',
                                    width: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'flex-end',
                                    justifyContent: 'flex-end',
                                }}
                            >
                                <Chat userInfo={userInfo} />
                            </Box>
                        </Grid>
                    </Grid>
                )}

                {/* Backdrop Loader */}
                <Backdrop open={isLoadingContent} sx={{ color: '#fff', zIndex: 10000 }}>
                    <CircularProgress color='inherit' />
                </Backdrop>
            </Box>
        </Layout>
    );
}
