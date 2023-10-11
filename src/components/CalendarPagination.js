import { Button, Typography } from '@mui/material';

export default function CalendarPagination({ week, setWeek, setSelectedBlocks }) {
    const curr_date = new Date();
    const aux_date = new Date();
    const first = curr_date.getDate() - curr_date.getDay();
    var mondayDate = new Date(aux_date.setDate(first + 1 + 7 * week)).toISOString().split('T')[0];
    var sundayDate = new Date(aux_date.setDate(first + 7 + 7 * week)).toISOString().split('T')[0];

    const handlePagination = direction => {
        setSelectedBlocks([]);

        if (direction === 'right') {
            setWeek(prevWeek => prevWeek + 1);
        } else {
            setWeek(prevWeek => prevWeek - 1);
        }
    };

    return (
        <div style={{ display: 'flex', gap: 10, justifyContent: 'end', marginBlock: 10, alignItems: 'center' }}>
            <Button variant='outlined' disabled={week === 0} onClick={() => handlePagination('left')}>
                {'<'}
            </Button>
            <Typography>
                {mondayDate} - {sundayDate}
            </Typography>
            <Button variant='outlined' onClick={() => handlePagination('right')}>
                {'>'}
            </Button>
        </div>
    );
}
