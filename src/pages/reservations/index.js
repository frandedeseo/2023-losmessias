import { Button } from '@mui/material';
import { useState } from 'react';

const blocks = [
    '09:00 - 09:30',
    '09:30 - 10:00',
    '10:00 - 10:30',
    '10:30 - 11:00',
    '11:00 - 11:30',
    '11:30 - 12:00',
    '12:00 - 12:30',
    '13:00 - 13:30',
    '13:30 - 14:00',
    '14:00 - 14:30',
    '14:30 - 15:00',
    '15:00 - 15:30',
    '15:30 - 16:00',
    '16:00 - 16:30',
    '16:30 - 17:00',
    '17:00 - 17:30',
    '17:30 - 18:00',
];

export default function Reservations() {
    const [selectedBlocks, setSelectedBlocks] = useState([]);

    const handleBlockSelection = (block, day) => {
        if (selectedBlocks.find(element => element.time === block && element.day === day) !== undefined) {
            setSelectedBlocks(prevBlocks =>
                prevBlocks.filter(element => {
                    if (element.time === block && element.day === day) return false;
                    return true;
                })
            );
        } else {
            setSelectedBlocks(prevBlocks => [...prevBlocks, { day, time: block }]);
        }
    };

    const active = (block, day) => {
        let exists = selectedBlocks.find(element => element.time === block && element.day === day);
        return exists !== undefined;
    };

    const handleCancel = () => {
        setSelectedBlocks([]);
    };

    const handleReserve = () => {
        let adaptedReservation = selectedBlocks.map(block => {
            const time = block.time.trim();
            return {
                day: block.day,
                startTime: time.split('-')[0],
                endTime: time.split('-')[1],
            };
        });
        console.log(adaptedReservation);
    };

    return (
        <div>
            <table style={{ border: '1px solid black', borderRadius: 5, borderSpacing: 0 }}>
                <thead>
                    <tr>
                        <th></th>
                        <th>Monday</th>
                        <th>Tuesday</th>
                        <th>Wednesday</th>
                        <th>Thursday</th>
                        <th>Friday</th>
                    </tr>
                </thead>
                <tbody>
                    {blocks.map(block => (
                        <tr key={block}>
                            <td>{block}</td>
                            <td
                                style={active(block, 'Monday') ? { backgroundColor: 'red' } : {}}
                                onClick={() => handleBlockSelection(block, 'Monday')}
                            ></td>
                            <td
                                style={active(block, 'Tuesday') ? { backgroundColor: 'red' } : {}}
                                onClick={() => handleBlockSelection(block, 'Tuesday')}
                            ></td>
                            <td
                                style={active(block, 'Wednesday') ? { backgroundColor: 'red' } : {}}
                                onClick={() => handleBlockSelection(block, 'Wednesday')}
                            ></td>
                            <td
                                style={active(block, 'Thursday') ? { backgroundColor: 'red' } : {}}
                                onClick={() => handleBlockSelection(block, 'Thursday')}
                            ></td>
                            <td
                                style={active(block, 'Friday') ? { backgroundColor: 'red' } : {}}
                                onClick={() => handleBlockSelection(block, 'Friday')}
                            ></td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <Button onClick={handleCancel}>Cancel</Button>
            <Button variant='contained' onClick={handleReserve}>
                Reserve
            </Button>
        </div>
    );
}
