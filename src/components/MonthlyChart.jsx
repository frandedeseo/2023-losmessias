import { Pie } from '@ant-design/charts';
import { Typography } from '@mui/material';
import PaidIcon from '@mui/icons-material/Paid';
import { getColor } from '@/utils/getColor';

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

export default function MonthlyChart({ legend = false }) {
    const configDonut = {
        appendPadding: 10,
        data,
        angleField: 'value',
        colorField: 'type',
        radius: 1,
        innerRadius: 0.55,
        legend: {
            legend,
            position: 'right',
        },
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
        <>
            <div style={{ justifyContent: 'center', display: 'flex' }}>
                <Pie {...configDonut} />
            </div>

            <Typography variant='h5' sx={{ marginBottom: '0.5rem', marginTop: '-1rem', textAlign: 'center' }}>
                Income
            </Typography>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'center' }}>
                <PaidIcon sx={{ fontSize: 30 }} />
                <Typography variant='h6'>1000</Typography>
            </div>
        </>
    );
}
