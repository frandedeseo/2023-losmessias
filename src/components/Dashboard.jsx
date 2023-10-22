// Mui
import { Pie } from '@ant-design/charts';
import { Card, Typography } from '@mui/material';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import PaidIcon from '@mui/icons-material/Paid';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

// Utils
import { getColor } from '@/utils/getColor';

export default function Dashboard({ id }) {
    const data = [
        { type: 'Math', value: 12 },
        {
            type: 'Biology',
            value: 8,
        },
        {
            type: 'Cancelled',
            value: 2,
        },
    ];

    const colors = data.map(val => {
        if (val.type !== 'Cancelled') return getColor(val.type);

        return '#ADB5BD';
    });

    const config = {
        appendPadding: 10,
        data,
        angleField: 'value',
        colorField: 'type',
        radius: 0.8,
        color: colors,
        legend: {
            position: 'bottom',
        },
        label: {
            type: 'inner',
            offset: '-30%',
            content: '{percentage}',
            style: {
                textAlign: 'center',
                fontSize: 16,
                fontWeight: 'bold',
                fill: 'black',
            },
        },
        interactions: [
            {
                type: 'pie-legend-active',
            },
            {
                type: 'element-active',
            },
        ],
    };

    const configDonut = {
        appendPadding: 10,
        data,
        angleField: 'value',
        colorField: 'type',
        radius: 1,
        innerRadius: 0.55,
        legend: false,
        color: colors,
        label: {
            type: 'inner',
            offset: '-50%',
            content: '{percentage}',
            style: {
                textAlign: 'center',
                fontSize: 16,
                fontWeight: 'bold',
                fill: 'black',
            },
        },
        interactions: [
            {
                type: 'element-selected',
            },
            {
                type: 'element-active',
            },
        ],
        statistic: {
            title: false,
            content: {
                customHtml: () => <Typography variant='h4'>22</Typography>,
                style: {
                    whiteSpace: 'pre-wrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                },
            },
        },
    };

    return (
        <div style={{ display: 'flex', gap: 10 }}>
            <Card sx={{ width: '65%', textAlign: 'center', padding: '1rem' }}>
                <Typography variant='h5'>Current Month</Typography>
                <div style={{ display: 'flex' }}>
                    <div style={{ width: '70%' }}>
                        <Pie {...config} />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 20 }}>
                        <div>
                            <Typography variant='h5' sx={{ marginBottom: '0.5rem' }}>
                                Total
                            </Typography>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <BookmarkIcon sx={{ fontSize: 30 }} />
                                <Typography variant='h6'>22</Typography>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <ArrowDropDownIcon color='error' sx={{ fontSize: 34 }} />
                                    <Typography variant='h6' sx={{ fontSize: 16, color: 'red' }}>
                                        %10
                                    </Typography>
                                </div>
                            </div>
                        </div>

                        <div>
                            <Typography variant='h5' sx={{ marginBottom: '0.5rem' }}>
                                Income
                            </Typography>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <PaidIcon sx={{ fontSize: 30 }} />
                                <Typography variant='h6'>1000</Typography>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <ArrowDropUpIcon color='success' sx={{ fontSize: 34 }} />
                                    <Typography variant='h6' sx={{ fontSize: 16, color: 'green' }}>
                                        %5
                                    </Typography>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>
            <Card style={{ width: '40%', textAlign: 'center', display: 'flex', flexDirection: 'column', padding: '1rem' }}>
                <Typography variant='h5'>Monthly Mean</Typography>
                <div style={{ justifyContent: 'center', display: 'flex' }}>
                    <Pie {...configDonut} style={{ width: '68%' }} />
                </div>

                <Typography variant='h5' sx={{ marginBottom: '0.5rem', marginTop: '-1.5rem' }}>
                    Income
                </Typography>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'center' }}>
                    <PaidIcon sx={{ fontSize: 30 }} />
                    <Typography variant='h6'>1000</Typography>
                </div>
            </Card>
        </div>
    );
}
