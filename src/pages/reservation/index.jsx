import React, { useState, useEffect } from 'react';
import { Box, Grid, CircularProgress } from '@mui/material';
import { useUser } from '@/context/UserContext';
import { useReservation } from '@/context/ReservationContext';
import MeetingLinkComponent from '@/components/MeetingLinkComponent';
import HorizontalProfessorCard from '../reservations/components/HorizontalProfessorCard';
import Chat from '@/components/Chat';

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
        <Box
            sx={{
                width: '100%',
                margin: '2rem auto',
            }}
        >
            <Grid container spacing={4}>
                {/* Left Column: Professor Card and Google Meet Link */}
                <Grid item xs={12} md={7}>
                    {/* Adjusted md to 4 */}
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

                {/* Right Column: Chat */}
                <Grid item xs={12} md={5}>
                    {/* Adjusted md to 8 */}
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

            {/* Show loading state if content is being fetched */}
            {isLoadingContent && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                    <CircularProgress />
                </Box>
            )}
        </Box>
    );
}
