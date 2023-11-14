import Calendar from '@/components/Calendar';
import CalendarPagination from '@/components/CalendarPagination';
import { useUser } from '@/context/UserContext';
import { Box, CircularProgress, Divider, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function StudentLandingPage() {
    const [week, setWeek] = useState(0);
    const [disabledBlocks, setDisabledBlocks] = useState([]);
    const user = useUser();
    const [isLoading, setIsLoading] = useState(false);

    var router = useRouter();

    useEffect(() => {
        setIsLoading(true);
        if (router.isReady && user.id) {
            if (user.authenticated){
                if (user.role == 'professor') {
                    router.push('/professor-landing');
                } else if (user.role === 'admin') {
                    router.push('/admin-landing');
                } else {
                    const requestOptions = {
                        method: 'GET',
                        headers: { Authorization: `Bearer ${user.token}` },
                    };
                    fetch(`${process.env.NEXT_PUBLIC_API_URI}/api/reservation/findByStudent?studentId=${user.id}`, requestOptions).then(res => {
                        res.json().then(json => {
                            setDisabledBlocks(
                                json.map(e => {
                                    if (e.day[1] < 10) e.day[1] = '0' + e.day[1];
                                    if (e.day[2] < 10) e.day[2] = '0' + e.day[2];
                                    if (e.startingHour[0] < 10) e.startingHour[0] = '0' + e.startingHour[0];
                                    if (e.startingHour[1] < 10) e.startingHour[1] = '0' + e.startingHour[1];
                                    if (e.endingHour[0] < 10) e.endingHour[0] = '0' + e.endingHour[0];
                                    if (e.endingHour[1] < 10) e.endingHour[1] = '0' + e.endingHour[1];

                                    return e;
                                })
                            );
                            setIsLoading(false);
                        });
                    });
                }
            }
            else {
                router.push('/');
            }
        }
    }, [user, router.isReady]);

    return (
        <div style={{ width: '95%', margin: 'auto' }}>
            {isLoading ? (
                <>
                    <Box
                        sx={{
                            height: 300,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <CircularProgress />
                    </Box>
                </>
            ) : (
            <>
            <Typography variant='h4' sx={{ margin: '2% 0' }}>
                Hi{' ' + user.firstName + ' ' + user.lastName}, welcome back!
            </Typography>

            <Typography variant='h4'>Agenda</Typography>
            <Divider />
            <div style={{ paddingBlock: '0.75rem' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <table style={{ height: '35px' }}>
                    <tbody>
                        <tr>
                            <td
                                style={{
                                    width: '130px',
                                    borderBlock: '1px solid #338aed70',
                                    backgroundColor: '#338aed90',
                                    textAlign: 'center',
                                }}
                            >
                                <Typography>Selected block</Typography>
                            </td>
                            <td
                                style={{
                                    textAlign: 'center',
                                    width: '130px',
                                    borderBlock: '1px solid #e64b4b70',
                                    backgroundColor: '#e64b4b90',
                                }}
                            >
                                <Typography>Reserved Class</Typography>
                            </td>
                            <td
                                style={{
                                    textAlign: 'center',
                                    width: '130px',
                                    borderBlock: '1px solid #adadad70',
                                    backgroundColor: '#adadad90',
                                }}
                            >
                                <Typography>Unavailable</Typography>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <CalendarPagination week={week} setWeek={setWeek} setSelectedBlocks={() => {}} />
            </div>
            <Calendar
                selectedBlocks={[]}
                setSelectedBlocks={() => {}}
                disabledBlocks={disabledBlocks}
                week={week}
                interactive={false}
                showData
            />
            </>
            )}
        </div>
    );
}
