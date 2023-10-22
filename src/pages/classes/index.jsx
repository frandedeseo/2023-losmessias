// Components
import ClassCard from '@/components/cards/ClassCard';

// Hooks
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useUser } from '@/context/UserContext';

// Utils
import { getColor } from '@/utils/getColor';

// Mui
import { Alert, Box, Chip, Divider, FormControl, InputLabel, MenuItem, OutlinedInput, Select, Snackbar, Typography } from '@mui/material';

export default function Professors() {
    const user = useUser();
    const [classes, setClasses] = useState([]);
    const [alert, setAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertSeverity, setAlertSeverity] = useState('');

    useEffect(() => {
        if (user.id) {
            const requestOptions = {
                method: 'GET',
                headers: { Authorization: `Bearer ${user.token}` },
            };

            if (user.role === 'student') {
                fetch(`${process.env.NEXT_PUBLIC_API_URI}/api/reservation/findByStudent?studentId=${user.id}`, requestOptions).then(res => {
                    res.json().then(json => {
                        setClasses(json);
                    });
                });
            } else {
                fetch(`${process.env.NEXT_PUBLIC_API_URI}/api/reservation/findByProfessor?professorId=${user.id}`, requestOptions).then(
                    res => {
                        res.json().then(json => {
                            setClasses(json);
                        });
                    }
                );
            }
        }
    }, [user]);

    const handleCancel = id => {
        fetch(`${process.env.NEXT_PUBLIC_API_URI}/api/reservation/cancel`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${user.token}`,
            },
            body: JSON.stringify({
                id,
                role: user.role.toUpperCase(),
            }),
        }).then(res => {
            if (res.status !== 200) {
                setAlertSeverity('error');
                setAlertMessage('There was an error making the reservation!');
                setAlert(true);
            } else {
                setClasses(prevClasses => prevClasses.filter(reservation => reservation.id !== id));
            }
        });
    };

    return (
        <>
            <Box
                sx={{
                    display: 'flex',
                    backgroundColor: '#F5F5F5',
                }}
            >
                <Box
                    sx={{
                        flexDirection: 'column',
                        minWidth: 300,
                        minHeight: 300,
                        display: 'flex',
                        borderColor: 'black',
                        borderWidth: '1pt',
                        borderRightStyle: 'solid',
                        px: 1,
                    }}
                >
                    <Typography variant='h3' component='div' sx={{ mt: 2, mb: 2, ml: 2 }} color={'black'}>
                        Filters
                    </Typography>
                    <Divider width={'100%'} sx={{ my: 2 }} />
                    {/* <FormControl sx={{ ml: 2, backgroundColor: '#fff' }}>
                        <InputLabel id='office-select'>Location</InputLabel>
                        <Select
                            multiple
                            labelId='office-select'
                            input={<OutlinedInput label='Location' />}
                            value={locationSelected}
                            onChange={event => handleLocationChange(event)}
                            onClose={handleFilter}
                            renderValue={selected => (
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                    {selected.map(value => (
                                        <Chip key={value} label={value} />
                                    ))}
                                </Box>
                            )}
                        >
                            {data.map((profesor, index) => (
                                <MenuItem key={index} value={profesor.location}>
                                    {profesor.location}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl> */}

                    {/* <FormControl sx={{ ml: 2, marginTop: '1.5rem', backgroundColor: '#fff' }}>
                        <InputLabel id='office-select'>Subjects</InputLabel>
                        <Select
                            multiple
                            labelId='office-select'
                            input={<OutlinedInput label='Subjects' />}
                            value={subjectSelected}
                            onChange={event => handleSubjectChange(event)}
                            onClose={handleFilter}
                            renderValue={selected => (
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                    {selected.map(value => (
                                        <Chip key={value} label={value} sx={{ backgroundColor: getColor(value) }} />
                                    ))}
                                </Box>
                            )}
                        >
                            {subjects.map(subject => (
                                <MenuItem key={subject.id} value={subject.name}>
                                    {subject.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl> */}
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap', mb: 2, ml: 2 }}>
                    {classes.map(reservation => (
                        <ClassCard reservation={reservation} style={{ mr: 3, mt: 2 }} cancel={handleCancel} />
                    ))}
                </Box>
            </Box>

            <Snackbar
                open={alert}
                autoHideDuration={3000}
                onClose={() => setAlert(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'top' }}
            >
                <Alert severity={alertSeverity}>{alertMessage}</Alert>
            </Snackbar>
        </>
    );
}
