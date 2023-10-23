import Calendar from '@/components/Calendar';
import CalendarPagination from '@/components/CalendarPagination';
import { useUser } from '@/context/UserContext';
import { order_and_group } from '@/utils/order_and_group';
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Snackbar, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

// Consts
const dayNumber = {
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
    Saturday: 6,
    Sunday: 7,
};

export default function StudentLandingPage() {
    const [week, setWeek] = useState(0);
    const [disabledBlocks, setDisabledBlocks] = useState([]);
    const user = useUser();

    var curr = new Date();
    var first = curr.getDate() - curr.getDay();
    var router = useRouter();

    useEffect(() => {
        if (router.isReady && user.authenticated) {
            if (user.role == 'admin') {
                router.push("/admin-landing");
            } else if (user.role == "professor") {
                router.push("/professor-landing");
            } else {
                const requestOptions = {
                    method: 'GET',
                    headers: { Authorization: `Bearer ${user.token}` },
                };
                fetch(`${process.env.NEXT_PUBLIC_API_URI}/api/reservation/findByStudent?studentId=${user.id}`, requestOptions).then(res => {
                    res.json().then(json => {
                        setDisabledBlocks(
                            json.map(e => {
                                if (e.day[2] < 10) e.day[2] = '0' + e.day[2];
                                return e;
                            })
                        );
                    });
                });
            }
        } else {
            router.push("/");
        }
    }, [user]);

    return (
        <div style={{ width: '95%', margin: 'auto' }}>
            <Typography variant='h4' sx={{ margin: '2% 0' }}>
                Hi{" " + user.firstName + " " + user.lastName}, welcome back!
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
                <CalendarPagination week={week} setWeek={setWeek} setSelectedBlocks={() => { }} />
            </div>
            <Calendar selectedBlocks={[]} setSelectedBlocks={() => { }} disabledBlocks={disabledBlocks} week={week} interactive={false} />
        </div>
    );
}
