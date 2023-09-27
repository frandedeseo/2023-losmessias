import { Typography } from '@mui/material';

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

export default function Calendar({ selectedBlocks, setSelectedBlocks }) {
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

    return (
        <table style={{ width: '90%', margin: 'auto', borderCollapse: 'collapse' }}>
            <thead style={{ height: '3rem', backgroundColor: '#fafafa' }}>
                <tr>
                    <th style={{ borderBottom: '1px solid #f0f0f0', width: '10%' }}></th>
                    <th style={{ borderBottom: '1px solid #f0f0f0' }}>
                        <Typography variant='h6'>Monday</Typography>
                    </th>
                    <th style={{ borderBottom: '1px solid #f0f0f0' }}>
                        <Typography variant='h6'>Tuesday</Typography>
                    </th>
                    <th style={{ borderBottom: '1px solid #f0f0f0' }}>
                        <Typography variant='h6'>Wednesday</Typography>
                    </th>
                    <th style={{ borderBottom: '1px solid #f0f0f0' }}>
                        <Typography variant='h6'>Thursday</Typography>
                    </th>
                    <th style={{ borderBottom: '1px solid #f0f0f0' }}>
                        <Typography variant='h6'>Friday</Typography>
                    </th>
                </tr>
            </thead>

            <tbody style={{ backgroundColor: '#fff' }}>
                {blocks.map(block => (
                    <tr key={block} style={{ height: '2.3rem' }}>
                        <td style={{ borderBlock: '1px solid #f0f0f0', textAlign: 'center' }}>
                            <Typography variant='body1'>{block}</Typography>
                        </td>
                        <td
                            style={active(block, 'Monday') ? { backgroundColor: '#86efac' } : { borderBlock: '1px solid #f0f0f0' }}
                            onClick={() => handleBlockSelection(block, 'Monday')}
                        ></td>
                        <td
                            style={active(block, 'Tuesday') ? { backgroundColor: '#86efac' } : { borderBlock: '1px solid #f0f0f0' }}
                            onClick={() => handleBlockSelection(block, 'Tuesday')}
                        ></td>
                        <td
                            style={active(block, 'Wednesday') ? { backgroundColor: '#86efac' } : { borderBlock: '1px solid #f0f0f0' }}
                            onClick={() => handleBlockSelection(block, 'Wednesday')}
                        ></td>
                        <td
                            style={active(block, 'Thursday') ? { backgroundColor: '#86efac' } : { borderBlock: '1px solid #f0f0f0' }}
                            onClick={() => handleBlockSelection(block, 'Thursday')}
                        ></td>
                        <td
                            style={active(block, 'Friday') ? { backgroundColor: '#86efac' } : { borderBlock: '1px solid #f0f0f0' }}
                            onClick={() => handleBlockSelection(block, 'Friday')}
                        ></td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
