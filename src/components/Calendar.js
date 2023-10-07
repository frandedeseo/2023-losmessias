import { Button, Typography } from '@mui/material';
import { useState } from 'react';
import CalendarPagination from './CalendarPagination';

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
const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const daysNumber = {
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
    Saturday: 6,
    Sunday: 7,
};

const styles = {
    block: {
        borderBlock: '1px solid #f0f0f0',
        cursor: 'pointer',
    },
    selected: {
        backgroundColor: '#1565c0',
        cursor: 'pointer',
    },
    disabled: {
        backgroundColor: 'grey',
    },
};

export default function Calendar({ selectedBlocks, setSelectedBlocks, week }) {
    var curr_date = new Date();

    const handleBlockSelection = (block, day) => {
        if (!day_disable(day)) {
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
        }
    };

    const active = (block, day) => {
        let exists = selectedBlocks.find(element => element.time === block && element.day === day);
        return exists !== undefined;
    };

    const day_disable = day => {
        if (week === 0 && curr_date.getDay() > daysNumber[day]) {
            return true;
        }

        return false;
    };

    const style_of_block = (block, day) => {
        let style = styles.block;
        if (active(block, day)) style = styles.selected;
        else if (day_disable(day)) style = styles.disabled;

        return style;
    };

    return (
        <>
            <table style={{ borderCollapse: 'collapse', width: '100%' }}>
                <thead style={{ height: '3rem', backgroundColor: '#fafafa' }}>
                    <tr>
                        <th style={{ borderBottom: '1px solid #f0f0f0', width: '10%' }}></th>
                        {days.map(day => (
                            <th style={{ borderBottom: '1px solid #f0f0f0' }}>
                                <Typography variant='h6'>{day}</Typography>
                            </th>
                        ))}
                    </tr>
                </thead>

                <tbody style={{ backgroundColor: '#fff' }}>
                    {blocks.map(block => (
                        <tr key={block} style={{ height: '2.3rem' }}>
                            <td style={{ borderBlock: '1px solid #f0f0f0', textAlign: 'center' }}>
                                <Typography variant='body1'>{block}</Typography>
                            </td>

                            {days.map(day => (
                                <td style={style_of_block(block, day)} onClick={() => handleBlockSelection(block, day)} />
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    );
}
